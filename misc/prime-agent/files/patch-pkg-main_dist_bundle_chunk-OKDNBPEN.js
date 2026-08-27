--- pkg-main/dist/bundle/chunk-OKDNBPEN.js.orig	1985-10-26 08:15:00 UTC
+++ pkg-main/dist/bundle/chunk-OKDNBPEN.js
@@ -11059,6 +11059,9 @@ function detectInstallMethod() {
   };
 }
 function detectInstallMethod() {
+  if (process.platform === "freebsd") {
+    return "freebsd";
+  }
   if (isBunBinary) {
     return "bun-binary";
   }
@@ -11235,6 +11238,9 @@ function getSelfUpdateUnavailableInstruction(packageNa
 }
 function getSelfUpdateUnavailableInstruction(packageName, npmCommand, updateSpec = packageName, updatePackageName = getDefaultUpdatePackageName(packageName, updateSpec)) {
   const method = detectInstallMethod();
+  if (method === "freebsd") {
+    return "Prime Agent is managed by the FreeBSD pkg(8) package manager. To update, run: sudo pkg upgrade prime-agent or doas pkg upgrade prime-agent";
+  }
   if (method === "bun-binary") {
     return `Download from: https://github.com/PrimeIntellect-ai/prime-agent/releases/latest`;
   }
