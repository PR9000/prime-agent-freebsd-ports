--- pkg-main/dist/bundle/chunk-MMG2DX73.js.orig
+++ pkg-main/dist/bundle/chunk-MMG2DX73.js
@@ -11059,6 +11059,9 @@
   };
 }
 function detectInstallMethod() {
+  if (process.platform === "freebsd") {
+    return "freebsd";
+  }
   if (isBunBinary) {
     return "bun-binary";
   }
@@ -11235,6 +11238,9 @@
 }
 function getSelfUpdateUnavailableInstruction(packageName, npmCommand, updateSpec = packageName, updatePackageName = getDefaultUpdatePackageName(packageName, updateSpec)) {
   const method = detectInstallMethod();
+  if (method === "freebsd") {
+    return "Prime Agent is managed by the FreeBSD pkg(8) package manager. To update, run: sudo pkg upgrade prime-agent or doas pkg upgrade prime-agent";
+  }
   if (method === "bun-binary") {
     return `Download from: https://github.com/PrimeIntellect-ai/prime-agent/releases/latest`;
   }
@@ -42529,7 +42535,11 @@
     if (missing.length === 0) {
       const missingExtraImports = await missingRlmExtraImportLabels(python2);
       if (missingExtraImports.length > 0) {
-        missing.push(`default Python packages (${missingExtraImports.join(", ")})`);
+        if (process.platform === "freebsd") {
+          reportProgress(options, `Warning: Default Python packages unavailable in PRIME_AGENT_KERNEL_PYTHON and will be disabled: ${missingExtraImports.join(", ")}`);
+        } else {
+          missing.push(`default Python packages (${missingExtraImports.join(", ")})`);
+        }
       }
     }
     if (missing.length === 0 && pythonSkills.length > 0) {
@@ -50887,16 +50897,55 @@
             return await result
         return result
 
+_FREEBSD_KNOWN_MODULE_PKGS = {
+    "PIL": "pillow (graphics/py-pillow)",
+    "pillow": "pillow (graphics/py-pillow)",
+    "httpx": "httpx (www/py-httpx)",
+    "mcp": "mcp (misc/py-mcp)",
+    "github": "PyGithub (devel/py-PyGithub)",
+    "slack_sdk": "slack-sdk (net-im/py-slack-sdk)",
+    "duckduckgo_search": "ddgs (www/py-ddgs)",
+    "google": "google-genai (devel/py-google-genai)",
+    "praw": "praw (www/py-praw)",
+    "tweepy": "tweepy (net/py-tweepy)",
+    "bs4": "beautifulsoup (www/py-beautifulsoup)",
+    "yaml": "pyyaml (devel/py-pyyaml)",
+    "requests": "requests (www/py-requests)",
+    "numpy": "numpy (math/py-numpy)",
+    "pandas": "pandas (math/py-pandas)",
+    "matplotlib": "matplotlib (math/py-matplotlib)",
+    "dotenv": "python-dotenv (www/py-python-dotenv)",
+    "lxml": "lxml (devel/py-lxml)",
+    "pydantic": "pydantic2 (devel/py-pydantic2)",
+}
+
 class _PrimeAgentUnavailableSkill:
     def __init__(self, name, error):
         self.__name__ = name
-        self._prime_agent_import_error = error
-        self.__doc__ = f"Python skill {name} is unavailable: {error}"
+        self._prime_agent_import_error = str(error)
+        py_tag = f"py{_prime_agent_sys.version_info.major}{_prime_agent_sys.version_info.minor}"
+        missing_mod = None
+        if "No module named " in self._prime_agent_import_error:
+            parts = self._prime_agent_import_error.split("No module named ", 1)[1].strip("'\" ").split(".")
+            missing_mod = parts[0] if parts else None
+        if missing_mod and missing_mod in _FREEBSD_KNOWN_MODULE_PKGS:
+            pkg_name = _FREEBSD_KNOWN_MODULE_PKGS[missing_mod].split()[0]
+            self._prime_agent_hint = f"pkg install {py_tag}-{pkg_name}"
+        elif missing_mod:
+            self._prime_agent_hint = f"pkg install {py_tag}-{missing_mod.replace('_', '-')}"
+        else:
+            self._prime_agent_hint = f"pkg search {name}"
+        self.__doc__ = (
+            f"Python skill '{name}' is unavailable on FreeBSD.\n"
+            f"Reason: {self._prime_agent_import_error}\n"
+            f"To install the required package on FreeBSD, run: {self._prime_agent_hint}"
+        )
 
     async def run(self, *args, **kwargs):
         raise RuntimeError(
-            f"Python skill {self.__name__} is unavailable in this kernel. "
-            f"Import error: {self._prime_agent_import_error}"
+            f"Python skill '{self.__name__}' is unavailable on FreeBSD. "
+            f"Missing module dependency. To fix: {self._prime_agent_hint}. "
+            f"Original import error: {self._prime_agent_import_error}"
         )
 
     async def __call__(self, *args, **kwargs):
