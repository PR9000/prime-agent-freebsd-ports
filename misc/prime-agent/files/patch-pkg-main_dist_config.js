--- pkg-main/dist/config.js.orig	1985-10-26 08:15:00 UTC
+++ pkg-main/dist/config.js
@@ -44,6 +44,9 @@ export function detectInstallMethod() {
     };
 }
 export function detectInstallMethod() {
+    if (process.platform === "freebsd") {
+        return "freebsd";
+    }
     if (isBunBinary) {
         return "bun-binary";
     }
@@ -240,6 +243,9 @@ export function getSelfUpdateUnavailableInstruction(pa
 }
 export function getSelfUpdateUnavailableInstruction(packageName, npmCommand, updateSpec = packageName, updatePackageName = getDefaultUpdatePackageName(packageName, updateSpec)) {
     const method = detectInstallMethod();
+    if (method === "freebsd") {
+        return "Prime Agent is managed by the FreeBSD pkg(8) package manager. To update, run: sudo pkg upgrade prime-agent or doas pkg upgrade prime-agent";
+    }
     if (method === "bun-binary") {
         return `Download from: https://github.com/PrimeIntellect-ai/prime-agent/releases/latest`;
     }
@@ -257,6 +263,9 @@ export function getUpdateInstruction(packageName) {
 }
 export function getUpdateInstruction(packageName) {
     const method = detectInstallMethod();
+    if (method === "freebsd") {
+        return "pkg upgrade prime-agent";
+    }
     const command = getSelfUpdateCommandForMethod(method, packageName);
     if (command) {
         return `Run: ${command.display}`;
