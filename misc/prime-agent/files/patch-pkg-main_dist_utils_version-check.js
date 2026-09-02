--- pkg-main/dist/utils/version-check.js.orig
+++ pkg-main/dist/utils/version-check.js
@@ -97,7 +97,7 @@
     }
 }
 export async function getLatestPiRelease(currentVersion, options = {}) {
-    if (process.env.PI_SKIP_VERSION_CHECK || process.env.PI_OFFLINE)
+    if (process.platform === "freebsd" || process.env.PI_SKIP_VERSION_CHECK || process.env.PI_OFFLINE)
         return undefined;
     const baseUrl = getPrimeAgentDownloadBaseUrl();
     const response = await fetch(`${baseUrl}/${getReleaseManifestPath(currentVersion)}`, {
