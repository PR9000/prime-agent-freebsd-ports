--- pkg-main/dist/utils/tools-manager.js.orig	2026-08-27 14:27:50 UTC
+++ pkg-main/dist/utils/tools-manager.js
@@ -229,8 +229,14 @@ const TERMUX_PACKAGES = {
     fd: "fd",
     rg: "ripgrep",
 };
+const FREEBSD_PACKAGES = {
+    fd: "fd-find",
+    rg: "ripgrep",
+};
 function getRipgrepInstallHint(platformName) {
     switch (platformName) {
+        case "freebsd":
+            return "Install it with: pkg install ripgrep";
         case "darwin":
             return "Install it with: brew install ripgrep";
         case "linux":
@@ -250,7 +256,9 @@ export function formatMissingRipgrepMessage(result) {
             reason = "Automatic installation was skipped because PI_OFFLINE is enabled.";
             break;
         case "manual_install_required":
-            reason = "Prime Agent cannot install this helper automatically in Termux.";
+            reason = result.platform === "freebsd"
+                ? "Prime Agent is managed by FreeBSD pkg(8). Please install the package."
+                : "Prime Agent cannot install this helper automatically in Termux.";
             break;
         case "unsupported_platform":
             reason = `Automatic installation is unavailable for ${result.platform}/${result.architecture}.`;
@@ -283,6 +291,19 @@ export async function ensureToolWithStatus(tool, silen
             console.log(chalk.yellow(`${config.name} not found. Offline mode enabled, skipping download.`));
         }
         return { status: "unavailable", reason: "offline", platform: platformName, architecture };
+    }
+    // On FreeBSD, binary downloads from GitHub releases are not compatible; install via pkg.
+    if (platformName === "freebsd") {
+        const pkgName = FREEBSD_PACKAGES[tool] ?? tool;
+        if (!silent) {
+            console.log(chalk.yellow(`${config.name} not found. Install with: pkg install ${pkgName}`));
+        }
+        return {
+            status: "unavailable",
+            reason: "manual_install_required",
+            platform: platformName,
+            architecture,
+        };
     }
     // On Android/Termux, Linux binaries don't work due to Bionic libc incompatibility.
     // Users must install via pkg.
