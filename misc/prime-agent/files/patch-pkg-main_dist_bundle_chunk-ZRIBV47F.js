--- pkg-main/dist/bundle/chunk-ZRIBV47F.js.orig	1985-10-26 08:15:00 UTC
+++ pkg-main/dist/bundle/chunk-ZRIBV47F.js
@@ -14941,7 +14941,7 @@ async function getLatestPiRelease(currentVersion, opti
   }
 }
 async function getLatestPiRelease(currentVersion, options = {}) {
-  if (process.env.PI_SKIP_VERSION_CHECK || process.env.PI_OFFLINE)
+  if (process.platform === "freebsd" || process.env.PI_SKIP_VERSION_CHECK || process.env.PI_OFFLINE)
     return void 0;
   const baseUrl = getPrimeAgentDownloadBaseUrl();
   const response = await fetch(`${baseUrl}/${getReleaseManifestPath(currentVersion)}`, {
@@ -14972,6 +14972,9 @@ async function checkForNewPiVersion(currentVersion) {
   return (await getLatestPiRelease(currentVersion, options))?.version;
 }
 async function checkForNewPiVersion(currentVersion) {
+  if (process.platform === "freebsd") {
+    return void 0;
+  }
   try {
     const latestVersion = await getLatestPiVersion(currentVersion);
     if (latestVersion && isNewerPackageVersion(latestVersion, currentVersion)) {
@@ -16096,51 +16099,9 @@ async function handlePackageCommand(args) {
           }
         }
         if (updateTargetIncludesSelf(target)) {
-          const selfUpdatePlan = await getSelfUpdatePlan(options.force);
-          if (!selfUpdatePlan.shouldRun) {
-            setSelfUpdateNoChangeExitCode();
-            return true;
-          }
-          const selfUpdateCommand = getSelfUpdateCommand(PACKAGE_NAME, selfUpdateNpmCommand, selfUpdatePlan.installSpec, selfUpdatePlan.packageName);
-          if (!selfUpdateCommand) {
-            printSelfUpdateUnavailable(selfUpdateNpmCommand, selfUpdatePlan.installSpec, selfUpdatePlan.packageName);
-            process.exitCode = 1;
-            return true;
-          }
-          const daemonSocketPath = resolveUpdateDaemonSocketPath(options.daemonSocketPath);
-          const daemonProbe = await probeRunningDaemonSessions(daemonSocketPath);
-          if (!await confirmDaemonSessionLossBeforeUpdate(daemonProbe, options.force)) {
-            if (process.stdin.isTTY) {
-              console.log(source_default.dim("Update cancelled."));
-            }
-            process.exitCode = 1;
-            return true;
-          }
-          try {
-            await runSelfUpdate(selfUpdateCommand);
-          } catch (error) {
-            const message = error instanceof Error ? error.message : "Unknown package command error";
-            console.error(source_default.red(`Error: ${message}`));
-            printSelfUpdateFallback(selfUpdateCommand);
-            process.exitCode = 1;
-            return true;
-          }
-          const versionChange = selfUpdatePlan.targetVersion ? ` from v${VERSION} to v${selfUpdatePlan.targetVersion}` : "";
-          console.log(source_default.green(`Updated ${APP_NAME}${versionChange}`));
-          if (process.env[SELF_UPDATE_INTERACTIVE_CHILD_ENV] === "1") {
-            return true;
-          }
-          try {
-            const status = await launchDaemonUpdateRestartCoordinator({
-              socketPath: daemonSocketPath,
-              agentDir,
-              cwd,
-              originActiveSessionId: process.env[DAEMON_WORKER_ACTIVE_SESSION_ID_ENV]
-            });
-            reportDaemonUpdateRestartStatus(status);
-          } catch (error) {
-            console.error(source_default.yellow(`Warning: updated, but could not coordinate the daemon restart (${formatUnknownError(error)}).`));
-          }
+          console.log("Prime Agent is managed by the FreeBSD pkg(8) package manager.");
+          console.log("To update Prime Agent, run: sudo pkg upgrade prime-agent or doas pkg upgrade prime-agent");
+          return true;
         }
         return true;
       }
@@ -32219,8 +32180,14 @@ var TERMUX_PACKAGES = {
   fd: "fd",
   rg: "ripgrep"
 };
+var FREEBSD_PACKAGES = {
+  fd: "fd-find",
+  rg: "ripgrep"
+};
 function getRipgrepInstallHint(platformName) {
   switch (platformName) {
+    case "freebsd":
+      return "Install it with: pkg install ripgrep";
     case "darwin":
       return "Install it with: brew install ripgrep";
     case "linux":
@@ -32240,7 +32207,7 @@ function formatMissingRipgrepMessage(result) {
       reason = "Automatic installation was skipped because PI_OFFLINE is enabled.";
       break;
     case "manual_install_required":
-      reason = "Prime Agent cannot install this helper automatically in Termux.";
+      reason = result.platform === "freebsd" ? "Prime Agent is managed by FreeBSD pkg(8). Please install the package." : "Prime Agent cannot install this helper automatically in Termux.";
       break;
     case "unsupported_platform":
       reason = `Automatic installation is unavailable for ${result.platform}/${result.architecture}.`;
@@ -32271,6 +32238,18 @@ async function ensureToolWithStatus(tool, silent = tru
     }
     return { status: "unavailable", reason: "offline", platform: platformName, architecture };
   }
+  if (platformName === "freebsd") {
+    const pkgName = FREEBSD_PACKAGES[tool] ?? tool;
+    if (!silent) {
+      console.log(source_default.yellow(`${config.name} not found. Install with: pkg install ${pkgName}`));
+    }
+    return {
+      status: "unavailable",
+      reason: "manual_install_required",
+      platform: platformName,
+      architecture
+    };
+  }
   if (platformName === "android") {
     const pkgName = TERMUX_PACKAGES[tool] ?? tool;
     if (!silent) {
@@ -48464,6 +48443,10 @@ ${result.message}`);
     }
   }
   async handleUpdateCommand(args) {
+    if (process.platform === "freebsd") {
+      this.showStatus("Prime Agent is managed by the FreeBSD pkg(8) package manager. To update, run: sudo pkg upgrade prime-agent or doas pkg upgrade prime-agent");
+      return;
+    }
     const entrypoint = process.argv[1];
     if (!entrypoint) {
       this.showError("Cannot determine current CLI entrypoint for update");
