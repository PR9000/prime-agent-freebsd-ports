--- pkg-main/dist/utils/version-check.js.orig	2026-08-27 14:27:50 UTC
+++ pkg-main/dist/utils/version-check.js
@@ -97,7 +97,7 @@ export async function getLatestPiRelease(currentVersio
     }
 }
 export async function getLatestPiRelease(currentVersion, options = {}) {
-    if (process.env.PI_SKIP_VERSION_CHECK || process.env.PI_OFFLINE)
+    if (process.platform === "freebsd" || process.env.PI_SKIP_VERSION_CHECK || process.env.PI_OFFLINE)
         return undefined;
     const baseUrl = getPrimeAgentDownloadBaseUrl();
     const response = await fetch(`${baseUrl}/${getReleaseManifestPath(currentVersion)}`, {
@@ -132,6 +132,9 @@ export async function checkForNewPiVersion(currentVers
     return (await getLatestPiRelease(currentVersion, options))?.version;
 }
 export async function checkForNewPiVersion(currentVersion) {
+    if (process.platform === "freebsd") {
+        return undefined;
+    }
     try {
         const latestVersion = await getLatestPiVersion(currentVersion);
         if (latestVersion && isNewerPackageVersion(latestVersion, currentVersion)) {
