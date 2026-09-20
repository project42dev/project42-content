#requires -Version 7.6
Set-StrictMode -Version Latest

function ConvertTo-UtcDateTime([object]$Value) {
    if ($null -eq $Value) { throw 'Timestamp is missing.' }

    if ($Value -is [datetime]) {
        $dateTime = [datetime]$Value
        if ($dateTime.Kind -eq [DateTimeKind]::Unspecified) {
            throw 'Timestamp DateTime has no timezone kind.'
        }
        if ($dateTime.Kind -eq [DateTimeKind]::Utc) { return $dateTime }
        return $dateTime.ToUniversalTime()
    }

    if ($Value -is [datetimeoffset]) {
        return ([datetimeoffset]$Value).UtcDateTime
    }

    $text = [string]$Value
    if ($text -notmatch '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{7}(?:Z|[+-]\d{2}:\d{2})$') {
        throw "Timestamp is not a valid ISO 8601 timestamp with an explicit offset: $text"
    }

    $parsed = [datetimeoffset]::MinValue
    if (-not [datetimeoffset]::TryParse(
        $text,
        [Globalization.CultureInfo]::InvariantCulture,
        [Globalization.DateTimeStyles]::None,
        [ref]$parsed)) {
        throw "Timestamp could not be parsed: $text"
    }
    return $parsed.UtcDateTime
}
