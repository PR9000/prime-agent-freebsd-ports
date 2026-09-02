--- pkg-main/dist/utils/tools-manager.js.orig
+++ pkg-main/dist/utils/tools-manager.js
@@ -225,12 +225,18 @@
     return binaryPath;
 }
 // Termux package names for tools
+const FREEBSD_PACKAGES = {
+    fd: "fd-find",
+    rg: "ripgrep",
+};
 const TERMUX_PACKAGES = {
     fd: "fd",
     rg: "ripgrep",
 };
 function getRipgrepInstallHint(platformName) {
     switch (platformName) {
+        case "freebsd":
+            return "Install it with: pkg install ripgrep";
         case "darwin":
             return "Install it with: brew install ripgrep";
         case "linux":
@@ -250,7 +256,9 @@
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
@@ -284,6 +292,18 @@
         }
         return { status: "unavailable", reason: "offline", platform: platformName, architecture };
     }
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
+    }
     // On Android/Termux, Linux binaries don't work due to Bionic libc incompatibility.
     // Users must install via pkg.
     if (platformName === "android") {
