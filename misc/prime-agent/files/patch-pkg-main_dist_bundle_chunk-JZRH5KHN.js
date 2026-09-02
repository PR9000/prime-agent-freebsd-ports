--- pkg-main/dist/bundle/chunk-JZRH5KHN.js.orig
+++ pkg-main/dist/bundle/chunk-JZRH5KHN.js
@@ -15050,7 +15050,7 @@
   }
 }
 async function getLatestPiRelease(currentVersion, options = {}) {
-  if (process.env.PI_SKIP_VERSION_CHECK || process.env.PI_OFFLINE)
+  if (process.platform === "freebsd" || process.env.PI_SKIP_VERSION_CHECK || process.env.PI_OFFLINE)
     return void 0;
   const baseUrl = getPrimeAgentDownloadBaseUrl();
   const response = await fetch(`${baseUrl}/${getReleaseManifestPath(currentVersion)}`, {
@@ -15081,6 +15081,9 @@
   return (await getLatestPiRelease(currentVersion, options))?.version;
 }
 async function checkForNewPiVersion(currentVersion) {
+  if (process.platform === "freebsd") {
+    return void 0;
+  }
   try {
     const latestVersion = await getLatestPiVersion(currentVersion);
     if (latestVersion && isNewerPackageVersion(latestVersion, currentVersion)) {
@@ -16205,51 +16208,9 @@
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
@@ -33203,8 +33164,14 @@
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
@@ -33224,7 +33191,7 @@
       reason = "Automatic installation was skipped because PI_OFFLINE is enabled.";
       break;
     case "manual_install_required":
-      reason = "Prime Agent cannot install this helper automatically in Termux.";
+      reason = result.platform === "freebsd" ? "Prime Agent is managed by FreeBSD pkg(8). Please install the package." : "Prime Agent cannot install this helper automatically in Termux.";
       break;
     case "unsupported_platform":
       reason = `Automatic installation is unavailable for ${result.platform}/${result.architecture}.`;
@@ -33255,6 +33222,18 @@
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
@@ -54033,6 +54012,10 @@
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
