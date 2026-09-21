# Optional host-isolation verification runbook

Status at publication: **UNVERIFIED**. These probes were not run as part of this artifact. They are optional and separate from the offline JavaScript repair. A local observation is not production containment proof.

Authoritative architecture references:

* Docker security: https://docs.docker.com/engine/security/
* gVisor documentation: https://gvisor.dev/docs/
* gVisor security model: https://gvisor.dev/docs/architecture_guide/security/
* Firecracker design: https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md

## Safety and status rules

Run only on an organization-approved disposable Linux host. Never expose a Docker socket, container runtime socket, Firecracker API socket, host credential, production network, or sensitive file to a probe. Use only the synthetic marker `PROJECT42_SYNTHETIC_PROBE`. Record each result as PASS, FAIL, SKIP, or UNVERIFIED. Missing prerequisites and unsupported capabilities are SKIP, never PASS. Store transcripts only in `training/ai-security-and-governance/guardrails-and-sandboxing/lab/test-scratch/`.

Use a preloaded immutable image digest, not a mutable tag. Do not pull an image. Do not mount host credentials, the Docker socket, another runtime socket, or any host directory. The commands below use no network, a read-only root, dropped capabilities, no-new-privileges, a PID limit, a memory limit, and only a bounded writable tmpfs.

## Shared prerequisites

1. Linux test host with no production workloads.
2. A non-production operator account permitted to use the selected runtime.
3. Runtime versions and configuration captured before testing.
4. No cloud metadata route and no production credentials on the host.
5. A preloaded, organization-approved probe image containing `/bin/sh`, `cat`, and `wget`. Set its immutable digest reference as `PROBE_IMAGE`, for example `registry.example.invalid/project42-probe@sha256:REPLACE_WITH_APPROVED_DIGEST`. The example is a placeholder and must not be used. Do not pull an image during this runbook.
6. Rootless operation where supported. If policy requires privileged operation, obtain operator approval and record it.

Prepare the transcript from the repository root:

```sh
LAB=training/ai-security-and-governance/guardrails-and-sandboxing/lab
mkdir -p "$LAB/test-scratch"
printf 'HOST ISOLATION STATUS: UNVERIFIED\n' > "$LAB/test-scratch/host-isolation.txt"
```

Expected observation: the file contains exactly `HOST ISOLATION STATUS: UNVERIFIED`. This setup is not a PASS.

## Fail-closed probe command

The following probe body is used by Docker and gVisor. Every required positive check and every required negative check has an explicit failure path. Exit status `0` means all checks passed. Exit status `125` means a prerequisite inside the image was unavailable, so the result is SKIP. Any other nonzero status is FAIL.

```sh
/bin/sh -c '
  command -v printf >/dev/null 2>&1 || exit 125
  command -v cat >/dev/null 2>&1 || exit 125
  command -v wget >/dev/null 2>&1 || exit 125
  if ! printf PROJECT42_SYNTHETIC_PROBE > /tmp/marker; then exit 10; fi
  marker=$(cat /tmp/marker) || exit 11
  [ "$marker" = PROJECT42_SYNTHETIC_PROBE ] || exit 12
  if wget -T 2 -q -O- http://192.0.2.1/ >/dev/null 2>&1; then exit 20; fi
  if touch /project42-host-write 2>/dev/null; then exit 21; fi
  exit 0
'
```

The `wget` availability check occurs before the negative network check. Therefore a missing tool is not mistaken for denied network access. The marker write and read must both succeed. The network operation must fail. The read-only-root write must fail. No final command is allowed to mask an earlier failure.

## Docker container probe

Additional prerequisites: Docker Engine installed; daemon access approved; `PROBE_IMAGE` set to an approved immutable digest; image entrypoint permits `/bin/sh`; and the image contains the required tools. Capture `docker version` and `docker info` before running.

```sh
LAB=training/ai-security-and-governance/guardrails-and-sandboxing/lab
: "${PROBE_IMAGE:?Set PROBE_IMAGE to a preloaded approved image digest}"
case "$PROBE_IMAGE" in *@sha256:*) ;; *) echo 'SKIP: PROBE_IMAGE is not an immutable digest' >> "$LAB/test-scratch/host-isolation.txt"; exit 0 ;; esac
if ! docker image inspect "$PROBE_IMAGE" >/dev/null 2>&1; then
  echo 'SKIP: approved image digest is not preloaded' >> "$LAB/test-scratch/host-isolation.txt"
  exit 0
fi
docker version >> "$LAB/test-scratch/host-isolation.txt" 2>&1 || exit 1
docker info >> "$LAB/test-scratch/host-isolation.txt" 2>&1 || exit 1
NAME="project42-probe-$$-$(date +%s)"
if docker container inspect "$NAME" >/dev/null 2>&1; then
  echo "SKIP: container name already exists: $NAME" >> "$LAB/test-scratch/host-isolation.txt"
  exit 0
fi
ID=''
cleanup() {
  if [ -n "$ID" ]; then
    docker container inspect "$ID" >> "$LAB/test-scratch/host-isolation.txt" 2>&1 || true
    docker rm "$ID" >> "$LAB/test-scratch/host-isolation.txt" 2>&1 || true
  fi
}
trap cleanup EXIT
set +e
docker run --name "$NAME" --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --pids-limit 32 --memory 128m \
  --tmpfs /tmp:rw,noexec,nosuid,nodev,size=16m \
  "$PROBE_IMAGE" /bin/sh -c '
    command -v printf >/dev/null 2>&1 || exit 125
    command -v cat >/dev/null 2>&1 || exit 125
    command -v wget >/dev/null 2>&1 || exit 125
    if ! printf PROJECT42_SYNTHETIC_PROBE > /tmp/marker; then exit 10; fi
    marker=$(cat /tmp/marker) || exit 11
    [ "$marker" = PROJECT42_SYNTHETIC_PROBE ] || exit 12
    if wget -T 2 -q -O- http://192.0.2.1/ >/dev/null 2>&1; then exit 20; fi
    if touch /project42-host-write 2>/dev/null; then exit 21; fi
    exit 0
  ' >> "$LAB/test-scratch/host-isolation.txt" 2>&1
RC=$?
ID=$(docker container inspect --format '{{.Id}}' "$NAME" 2>/dev/null)
if [ -z "$ID" ]; then
  echo 'FAIL: container was not inspectable after execution' >> "$LAB/test-scratch/host-isolation.txt"
  exit 1
fi
printf 'Docker retained inspect:\n' >> "$LAB/test-scratch/host-isolation.txt"
docker container inspect "$ID" >> "$LAB/test-scratch/host-isolation.txt" 2>&1 || exit 1
if [ "$RC" -eq 0 ]; then
  echo 'Docker probe: PASS' >> "$LAB/test-scratch/host-isolation.txt"
elif [ "$RC" -eq 125 ]; then
  echo 'Docker probe: SKIP' >> "$LAB/test-scratch/host-isolation.txt"
else
  echo "Docker probe: FAIL (exit $RC)" >> "$LAB/test-scratch/host-isolation.txt"
fi
```

The container is deliberately retained until inspection completes. Cleanup removes only the ID created by this invocation, never a pre-existing resource. A successful probe is PASS only for the stated synthetic observations, not for escape resistance. If Docker is unavailable, a flag is unsupported, the image is absent, or configuration cannot be inspected, record SKIP. If a prohibited operation succeeds, record FAIL.

Expected observations: writing and reading the tmpfs marker succeeds; the documentation-only address `192.0.2.1` is unreachable because the container has no network; writing the read-only root fails; and the requested limits are visible in inspection.

Boundary interpretation: namespaces and cgroups surround a workload that shares the host kernel. Cgroups limit resources but do not provide data isolation. Docker daemon access remains privileged control-plane access. Source: https://docs.docker.com/engine/security/

## gVisor probe

Additional prerequisites: `runsc` installed according to the official gVisor documentation; Docker configured with a runtime named `runsc`; the same preloaded digest `PROBE_IMAGE`; and host cgroup limits enabled.

```sh
runsc --version >> "$LAB/test-scratch/host-isolation.txt" 2>&1 || { echo 'gVisor probe: SKIP' >> "$LAB/test-scratch/host-isolation.txt"; exit 0; }
docker info --format '{{json .Runtimes}}' >> "$LAB/test-scratch/host-isolation.txt" 2>&1 || { echo 'gVisor probe: SKIP' >> "$LAB/test-scratch/host-isolation.txt"; exit 0; }
```

Expected observation: `runsc` reports a version and Docker's runtime map contains `runsc`. Otherwise record SKIP. Confirm from runtime logs or approved runtime inspection that `runsc` handled the container. If that cannot be established, record UNVERIFIED rather than PASS.

Run the same retained, fail-closed probe with the additional runtime selection:

```sh
NAME="project42-gvisor-probe-$$-$(date +%s)"
if docker container inspect "$NAME" >/dev/null 2>&1; then echo "SKIP: container name already exists: $NAME"; exit 0; fi
ID=''
cleanup() { if [ -n "$ID" ]; then docker container inspect "$ID" >/dev/null 2>&1 || true; docker rm "$ID" >/dev/null 2>&1 || true; fi; }
trap cleanup EXIT
set +e
docker run --name "$NAME" --runtime=runsc --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --pids-limit 32 --memory 128m \
  --tmpfs /tmp:rw,noexec,nosuid,nodev,size=16m \
  "$PROBE_IMAGE" /bin/sh -c '
    command -v printf >/dev/null 2>&1 || exit 125
    command -v cat >/dev/null 2>&1 || exit 125
    command -v wget >/dev/null 2>&1 || exit 125
    if ! printf PROJECT42_SYNTHETIC_PROBE > /tmp/marker; then exit 10; fi
    marker=$(cat /tmp/marker) || exit 11
    [ "$marker" = PROJECT42_SYNTHETIC_PROBE ] || exit 12
    if wget -T 2 -q -O- http://192.0.2.1/ >/dev/null 2>&1; then exit 20; fi
    if touch /project42-host-write 2>/dev/null; then exit 21; fi
    exit 0
  ' >> "$LAB/test-scratch/host-isolation.txt" 2>&1
RC=$?
ID=$(docker container inspect --format '{{.Id}}' "$NAME" 2>/dev/null)
[ -n "$ID" ] || { echo 'gVisor probe: FAIL, container was not inspectable' >> "$LAB/test-scratch/host-isolation.txt"; exit 1; }
docker container inspect "$ID" >> "$LAB/test-scratch/host-isolation.txt" 2>&1 || exit 1
if [ "$RC" -eq 0 ]; then echo 'gVisor synthetic probe: PASS, pending runtime confirmation' >> "$LAB/test-scratch/host-isolation.txt"; elif [ "$RC" -eq 125 ]; then echo 'gVisor probe: SKIP' >> "$LAB/test-scratch/host-isolation.txt"; else echo "gVisor probe: FAIL (exit $RC)" >> "$LAB/test-scratch/host-isolation.txt"; fi
```

The architectural boundary is the Sentry userspace application kernel and Gofer before a restricted host interface. Host cgroups, egress policy, control-plane security, and platform side-channel mitigations remain external dependencies. Source: https://gvisor.dev/docs/architecture_guide/security/

## Firecracker microVM probe

Firecracker requires more than a binary. Exact prerequisites are: Linux with KVM available; an approved Firecracker release and matching jailer; a synthetic guest kernel and root filesystem whose provenance and digest are recorded; an unprivileged jailer identity; an empty per-VM chroot; cgroup configuration; a unique API socket under the disposable workspace; a TAP device attached only to an isolated test network; and host firewall policy that denies all egress from that TAP. Do not substitute a production image, bridge, key, or network.

Because this repository does not supply or attest a guest kernel, root filesystem, TAP configuration, firewall rules, or privileged launcher, the Firecracker probe is **SKIP** until an operator supplies and reviews all prerequisites. This explicit skip is required and is not a PASS.

Once those prerequisites exist, the approved operator must perform these exact observations through the organization's launcher:

1. Record `firecracker --version` and `jailer --version`.
2. Record digests of the synthetic guest kernel and root filesystem.
3. Launch only through `jailer`, as an unprivileged identity, with cgroup CPU and memory limits and a unique chroot.
4. Inside the guest, write `PROJECT42_SYNTHETIC_PROBE` to its synthetic scratch disk and read it back. Any failed write or read is FAIL.
5. Verify a usable guest network client before the negative network test. Attempt a connection to `192.0.2.1` with a two-second timeout. A successful connection is FAIL. A missing client or unavailable inspection is SKIP or UNVERIFIED, not PASS.
6. From the guest, attempt to read a host-only synthetic marker that was not mapped into the microVM. A successful read is FAIL.
7. From the host, confirm the Firecracker process identity, jailer chroot, cgroup membership, seccomp configuration, TAP attachment, and deny-all firewall counters.
8. Stop the microVM, remove its TAP device and API socket, and retain only the redacted transcript under `lab/test-scratch`.

If any required inspection is unavailable, record UNVERIFIED. If egress or host-only marker access succeeds, record FAIL. If every observation matches, record PASS only for the stated synthetic probe. Firecracker itself performs no network traffic filtering, so the egress result is evidence about the host firewall configuration, not a built-in Firecracker control. Source: https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md

## Final report template

```text
Docker probe: UNVERIFIED
Docker residual dependencies: host kernel, daemon control plane, egress policy, cgroups, image provenance

gVisor probe: UNVERIFIED
gVisor residual dependencies: host kernel interface, cgroups, egress policy, runtime control plane, platform side channels

Firecracker probe: SKIP
Firecracker residual dependencies: KVM and host kernel, jailer configuration, cgroups, TAP firewall, kernel/rootfs provenance, control plane, platform side channels

Production containment claim: NOT ESTABLISHED
```
