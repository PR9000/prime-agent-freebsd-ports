--- pkg-main/dist/core/tools/ipython.js.orig	1985-10-26 08:15:00 UTC
+++ pkg-main/dist/core/tools/ipython.js
@@ -73,23 +73,60 @@ class _PrimeAgentCallableSkillModule(_prime_agent_type
             return await result
         return result
 
+_FREEBSD_KNOWN_MODULE_PKGS = {
+    "PIL": "pillow (graphics/py-pillow)",
+    "pillow": "pillow (graphics/py-pillow)",
+    "httpx": "httpx (www/py-httpx)",
+    "mcp": "mcp (misc/py-mcp)",
+    "github": "pygithub (devel/py-pygithub)",
+    "slack_sdk": "slack-sdk (net-im/py-slack-sdk)",
+    "duckduckgo_search": "duckduckgo-search (www/py-duckduckgo-search)",
+    "google": "google-genai (devel/py-google-genai)",
+    "praw": "praw (www/py-praw)",
+    "tweepy": "tweepy (net/py-tweepy)",
+    "bs4": "beautifulsoup (www/py-beautifulsoup)",
+    "yaml": "pyyaml (devel/py-pyyaml)",
+    "requests": "requests (www/py-requests)",
+    "numpy": "numpy (math/py-numpy)",
+    "pandas": "pandas (math/py-pandas)",
+    "matplotlib": "matplotlib (math/py-matplotlib)",
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
+            f"Python skill '{name}' is unavailable on FreeBSD.\\n"
+            f"Reason: {self._prime_agent_import_error}\\n"
+            f"To install the required package on FreeBSD, run: {self._prime_agent_hint}"
+        )
 
     async def run(self, *args, **kwargs):
         raise RuntimeError(
-            f"Python skill {self.__name__} is unavailable in this IPython kernel. "
-            f"Import error: {self._prime_agent_import_error}"
+            f"Python skill '{self.__name__}' is unavailable in this FreeBSD IPython kernel.\\n"
+            f"Reason: {self._prime_agent_import_error}\\n"
+            f"👉 To install the required dependency on FreeBSD, run:\\n"
+            f"   # {self._prime_agent_hint}"
         )
 
     async def __call__(self, *args, **kwargs):
         return await self.run(*args, **kwargs)
 
     def __repr__(self):
-        return f"<unavailable Python skill {self.__name__!r}: {self._prime_agent_import_error}>"
+        return f"<unavailable Python skill {self.__name__!r} (missing dependency: {self._prime_agent_hint})>"
 
 def _prime_agent_wrap_skill_module(module):
     run = getattr(module, "run", None)
