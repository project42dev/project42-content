# Optional host-isolation verification runbook

Status at publication: **UNVERIFIED**. These probes were not run as part of this artifact. They are optional and separate from the offline JavaScript repair. A local observation is not production containment proof.

Authoritative architecture references:

* Docker security: https://docs.docker.com/engine/security/
* gVisor documentation: https://gvisor.dev/docs/
* gVisor security model: https://gvisor.dev/docs/architecture_guide/security/
* Firecracker design: https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md

## Safety and status rules

Run only on an organization-approved disposable Linux host. Never expose a Docker socket, container runtime socket, Firecracker API socket, host credential, production network, or sensitive file to a probe. Use only the synthetic marker `PROJECT42_SYNTHETIC_PROBE`. Record each result as PASS, FAIL, SKIP, or UNVERIFIED. Missing prerequisites and unsupported capabilities are SKIP, never PASS. Store transcripts only in `training/ai-security-and-governance/guardrails-and-sandboxing/lab/test-scratch/`.

## Shared prerequisites

1. Linux test host with no production workloads.
2. A non-production operator account permitted to use the selected runtime.
3. Runtime versions and configuration captured before testing.
4. No cloud metadata route and no production credentials on the host.
5. A preloaded, organization-approved probe image containing `/bin/sh`, `cat`, and `wget`. Set its immutable digest reference as `PROBE_IMAGE`. Do not pull an image during this runbook.
6. Rootless operation where supported. If policy requires privileged operation, obtain operator approval and record it.

Prepare the transcript from the repository root:

```sh
LAB=training/ai-security-and-governance/guardrails-and-sandboxing/lab
mkdir -p "$LAB/test-scratch"
printf 'HOST ISOLATION STATUS: UNVERIFIED\n' > "$LAB/test-scratch/host-isolation.txt"
```

Expected observation: the file contains exactly `HOST ISOLATION STATUS: UNVERIFIED`. This setup is not a PASS.

## Docker container probe

Additional prerequisites: Docker Engine installed; daemon access approved; `PROBE_IMAGE` set to the preloaded digest; image entrypoint permits `/bin/sh`.

Capture configuration:

```sh
docker version >> "$LAB/test-scratch/host-isolation.txt" 2>&1
docker info >> "$LAB/test-scratch/host-isolation.txt" 2>&1
```

Run a synthetic probe with no network, read-only root, dropped capabilities, no-new-privileges, PID and memory limits, and a writable tmpfs only:

```sh
docker run --rm --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --pids-limit 32 --memory 128m \
  --tmpfs /tmp:rw,noexec,nosuid,nodev,size=16m \
  "$PROBE_IMAGE" /bin/sh -c '
    printf PROJECT42_SYNTHETIC_PROBE > /tmp/marker
    test "$(cat /tmp/marker)" = PROJECT42_SYNTHETIC_PROBE
    ! wget -T 2 -q -O- http://192.0.2.1/
    ! touch /project42-host-write
  ' >> "$LAB/test-scratch/host-isolation.txt" 2>&1
```

Expected observations: writing and reading the tmpfs marker succeeds; the documentation-only address `192.0.2.1` is unreachable because the container has no network; writing the read-only root fails; the container exits 0 because each prohibited operation is negated. Also inspect `docker inspect` or daemon policy to confirm the requested limits were applied. If the image is absent, Docker is unavailable, any flag is unsupported, or configuration cannot be inspected, record SKIP. If a prohibited operation succeeds, record FAIL. A successful probe is PASS only for these observations, not for escape resistance.

Boundary interpretation: namespaces and cgroups surround a workload that shares the host kernel. Cgroups limit resources but do not provide data isolation. Docker daemon access remains privileged control-plane access.

## gVisor probe

Additional prerequisites: `runsc` installed according to the official gVisor documentation; Docker configured with a runtime named `runsc`; the same preloaded `PROBE_IMAGE`; host cgroup limits enabled.

Confirm runtime registration:

```sh
runsc --version >> "$LAB/test-scratch/host-isolation.txt" 2>&1
docker info --format '{{json .Runtimes}}' >> "$LAB/test-scratch/host-isolation.txt" 2>&1
```

Expected observation: `runsc` reports a version and Docker's runtime map contains `runsc`. Otherwise record SKIP.

Run the same safe probe through gVisor:

```sh
docker run --rm --runtime=runsc --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --pids-limit 32 --memory 128m \
  --tmpfs /tmp:rw,noexec,nosuid,nodev,size=16m \
  "$PROBE_IMAGE" /bin/sh -c '
    printf PROJECT42_SYNTHETIC_PROBE > /tmp/marker
    test "$(cat /tmp/marker)" = PROJECT42_SYNTHETIC_PROBE
    ! wget -T 2 -q -O- http://192.0.2.1/
    ! touch /project42-host-write
  ' >> "$LAB/test-scratch/host-isolation.txt" 2>&1
```

Expected observations and status rules are the same as the Docker probe. Additionally confirm from runtime logs or approved runtime inspection that `runsc` handled the container. If that cannot be established, record UNVERIFIED rather than PASS. The architectural boundary is the Sentry userspace application kernel and Gofer before a restricted host interface. Host cgroups, egress policy, control-plane security, and platform side-channel mitigations remain external dependencies.

## Firecracker microVM probe

Firecracker requires more than a binary. Exact prerequisites are: Linux with KVM available; an approved Firecracker release and matching jailer; a synthetic guest kernel and root filesystem whose provenance and digest are recorded; an unprivileged jailer identity; an empty per-VM chroot; cgroup configuration; a unique API socket under the disposable workspace; a TAP device attached only to an isolated test network; and host firewall policy that denies all egress from that TAP. Do not substitute a production image, bridge, key, or network.

Because this repository does not supply or attest a guest kernel, root filesystem, TAP configuration, firewall rules, or privileged launcher, the Firecracker probe is **SKIP** until an operator supplies and reviews all prerequisites. This explicit skip is required and is not a PASS.

Once those prerequisites exist, the approved operator must perform these exact observations through the organization's launcher:

1. Record `firecracker --version` and `jailer --version`.
2. Record digests of the synthetic guest kernel and root filesystem.
3. Launch only through `jailer`, as an unprivileged identity, with cgroup CPU and memory limits and a unique chroot.
4. Inside the guest, write `PROJECT42_SYNTHETIC_PROBE` to its synthetic scratch disk and read it back.
5. Attempt a connection to `192.0.2.1` with a two-second timeout. Expected observation: host firewall policy denies it.
6. From the guest, attempt to read a host-only synthetic marker that was not mapped into the microVM. Expected observation: the path is absent.
7. From the host, confirm the Firecracker process identity, jailer chroot, cgroup membership, seccomp configuration, TAP attachment, and deny-all firewall counters.
8. Stop the microVM, remove its TAP device and API socket, and retain only the redacted transcript under `lab/test-scratch`.

If any required inspection is unavailable, record UNVERIFIED. If egress or host-only marker access succeeds, record FAIL. If every observation matches, record PASS only for the stated synthetic probe. Firecracker itself performs no network traffic filtering, so the egress result is evidence about the host firewall configuration, not a built-in Firecracker control.

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
