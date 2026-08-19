#!/bin/sh
# make-distinfos.sh - (re)generate distinfo(5) files for every port in this
# FreeBSD ports tree, dynamically (no hardcoded port list).
#
# It walks the tree, finds every directory containing a Makefile, and runs
#   make makesum
# in it.  That is the port's own mechanism, so MASTER_SITES / DISTFILES /
# NO_BUILD / flavors are all honoured and the generated checksums always
# match the Makefile's declared source.
#
# Meta-ports with no distfile (NO_BUILD=yes + DISTFILES=# none) are skipped.
#
# Usage:
#   ./scripts/make-distinfos.sh            # generate everything
#   ./scripts/make-distinfos.sh --dry-run  # list ports without writing
#
# Must run on a FreeBSD host with the ports framework (bsd.port.mk).
# For LOCAL/ ports the distfile *must* already be staged in ${DISTDIR}.

set -u

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
DRY_RUN=0
case "${1:-}" in
	-n|--dry-run) DRY_RUN=1 ;;
	-h|--help)    echo "usage: $0 [--dry-run|-n]"; exit 0 ;;
	"")           ;;
	*)            echo "usage: $0 [--dry-run|-n]" >&2; exit 64 ;;
esac

cd "$ROOT" || { echo "ERROR: cannot cd to $ROOT" >&2; exit 64; }

list=$(mktemp) || exit 1
trap 'rm -f "$list"' EXIT INT TERM HUP

# Every dir that owns a Makefile (excludes work dirs and .git).
find . -name Makefile -not -path './.git/*' -not -path '*/work/*' -print \
	| sed -e 's#/Makefile##' | sort -u > "$list"

n_total=$(grep -c . "$list" || echo 0)
[ "${n_total:-0}" -eq 0 ] && { echo "ERROR: no ports found under $ROOT" >&2; exit 1; }

if [ "$DRY_RUN" -eq 1 ]; then
	echo "Dry-run: would run 'make makesum' in ${n_total} port(s):"
	sed 's#^\./#  - #' "$list"
	exit 0
fi

echo "Regenerating distinfo for ${n_total} port(s) under ${ROOT} ..."

n_ok=0
n_fail=0
n_skip=0

while IFS= read -r portdir || [ -n "$portdir" ]; do
	port=$(basename "$portdir")
	mf="$portdir/Makefile"

	# Skip pure meta-ports that carry no distfile.
	if grep -qE '^[[:space:]]*NO_BUILD[[:space:]]*=[[:space:]]*yes' "$mf" \
		&& grep -qE '^[[:space:]]*DISTFILES[[:space:]]*=[[:space:]]*(#[[:space:]]*none|$)' "$mf"; then
		printf '%-6s %s (meta-port, no distfile)\n' "SKIP" "$port"
		n_skip=$((n_skip + 1))
		continue
	fi

	res=$( ( cd "$portdir" && make makesum ) 2>&1 ) && rc=0 || rc=$?
	if [ "$rc" -eq 0 ]; then
		printf '%-6s %s\n' "OK" "$port"
		n_ok=$((n_ok + 1))
	else
		printf '%-6s %s\n' "FAIL" "$port"
		printf '      (make makesum rc=%d, tail log:)\n' "$rc"
		printf '%s\n' "$res" | sed 's/^/        /' | tail -6
		n_fail=$((n_fail + 1))
	fi
done < "$list"

printf '\n=== distinfo summary: OK=%d  FAIL=%d  SKIP=%d  (total=%d)\n' \
	"$n_ok" "$n_fail" "$n_skip" "$n_total"

[ "$n_fail" -eq 0 ]
