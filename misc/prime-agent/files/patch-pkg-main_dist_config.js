--- pkg-main/dist/config.js.orig
+++ pkg-main/dist/config.js
@@ -44,6 +44,9 @@
     };
 }
 export function detectInstallMethod() {
+    if (process.platform === "freebsd") {
+        return "freebsd";
+    }
     if (isBunBinary) {
         return "bun-binary";
     }
@@ -240,6 +243,9 @@
 }
 export function getSelfUpdateUnavailableInstruction(packageName, npmCommand, updateSpec = packageName, updatePackageName = getDefaultUpdatePackageName(packageName, updateSpec)) {
     const method = detectInstallMethod();
+    if (method === "freebsd") {
+        return `This installation is managed by FreeBSD packages. Update with: pkg upgrade prime-agent`;
+    }
     if (method === "bun-binary") {
         return `Download from: https://github.com/PrimeIntellect-ai/prime-agent/releases/latest`;
     }
