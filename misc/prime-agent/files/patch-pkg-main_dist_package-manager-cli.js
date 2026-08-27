--- pkg-main/dist/package-manager-cli.js.orig	1985-10-26 08:15:00 UTC
+++ pkg-main/dist/package-manager-cli.js
@@ -1271,56 +1271,9 @@ export async function handlePackageCommand(args) {
                     }
                 }
                 if (updateTargetIncludesSelf(target)) {
-                    const selfUpdatePlan = await getSelfUpdatePlan(options.force);
-                    if (!selfUpdatePlan.shouldRun) {
-                        setSelfUpdateNoChangeExitCode();
-                        return true;
-                    }
-                    const selfUpdateCommand = getSelfUpdateCommand(PACKAGE_NAME, selfUpdateNpmCommand, selfUpdatePlan.installSpec, selfUpdatePlan.packageName);
-                    if (!selfUpdateCommand) {
-                        printSelfUpdateUnavailable(selfUpdateNpmCommand, selfUpdatePlan.installSpec, selfUpdatePlan.packageName);
-                        process.exitCode = 1;
-                        return true;
-                    }
-                    // Confirm before the install, since upgrading the daemon afterward stops and resumes busy work.
-                    const daemonSocketPath = resolveUpdateDaemonSocketPath(options.daemonSocketPath);
-                    const daemonProbe = await probeRunningDaemonSessions(daemonSocketPath);
-                    if (!(await confirmDaemonSessionLossBeforeUpdate(daemonProbe, options.force))) {
-                        if (process.stdin.isTTY) {
-                            console.log(chalk.dim("Update cancelled."));
-                        }
-                        process.exitCode = 1;
-                        return true;
-                    }
-                    try {
-                        await runSelfUpdate(selfUpdateCommand);
-                    }
-                    catch (error) {
-                        const message = error instanceof Error ? error.message : "Unknown package command error";
-                        console.error(chalk.red(`Error: ${message}`));
-                        printSelfUpdateFallback(selfUpdateCommand);
-                        process.exitCode = 1;
-                        return true;
-                    }
-                    const versionChange = selfUpdatePlan.targetVersion
-                        ? ` from v${VERSION} to v${selfUpdatePlan.targetVersion}`
-                        : "";
-                    console.log(chalk.green(`Updated ${APP_NAME}${versionChange}`));
-                    if (process.env[SELF_UPDATE_INTERACTIVE_CHILD_ENV] === "1") {
-                        return true;
-                    }
-                    try {
-                        const status = await launchDaemonUpdateRestartCoordinator({
-                            socketPath: daemonSocketPath,
-                            agentDir,
-                            cwd,
-                            originActiveSessionId: process.env[DAEMON_WORKER_ACTIVE_SESSION_ID_ENV],
-                        });
-                        reportDaemonUpdateRestartStatus(status);
-                    }
-                    catch (error) {
-                        console.error(chalk.yellow(`Warning: updated, but could not coordinate the daemon restart (${formatUnknownError(error)}).`));
-                    }
+                    console.log("Prime Agent is managed by the FreeBSD pkg(8) package manager.");
+                    console.log("To update Prime Agent, run: sudo pkg upgrade prime-agent or doas pkg upgrade prime-agent");
+                    return true;
                 }
                 return true;
             }
