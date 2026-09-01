PORTNAME=	prime-agent
DISTVERSION=	0.8.1
CATEGORIES=	misc python
MASTER_SITES=	https://github.com/PrimeIntellect-ai/prime-agent/releases/download/v${DISTVERSION}/
DISTFILES=	prime-agent-${DISTVERSION}.tgz \
		prime-agent-ai-${DISTVERSION}.tgz \
		prime-agent-core-${DISTVERSION}.tgz \
		prime-agent-tui-${DISTVERSION}.tgz

MAINTAINER=	pr9000@tutamail.com
COMMENT=	Self-improving AI coding assistant with IPython-backed kernel
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

BUILD_DEPENDS=	cmake:devel/cmake \
		ninja:devel/ninja \
		pkgconf:devel/pkgconf \
		libzmq4>0:net/libzmq4 \
		npm>0:www/npm
RUN_DEPENDS=	${PYTHON_PKGNAMEPREFIX}prime-agent-runtime>=0:misc/py-prime-agent-runtime@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}dill>=0.3:devel/py-dill@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}ipykernel>=6.0:devel/py-ipykernel@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}lxml>=0:devel/py-lxml@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}nest-asyncio2>=1.0:devel/py-nest-asyncio2@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}pydantic2>=2.0:devel/py-pydantic2@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}pyyaml>=0:devel/py-pyyaml@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}tyro>=1.0.15:devel/py-tyro@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}pillow>=0:graphics/py-pillow@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}mcp>=0:misc/py-mcp@${PY_FLAVOR} \
		libzmq4>0:net/libzmq4 \
		${PYTHON_PKGNAMEPREFIX}pyzmq>=0:net/py-pyzmq@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}tomli>=0:textproc/py-tomli@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}beautifulsoup>=0:www/py-beautifulsoup@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}httpx>=0:www/py-httpx@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}python-dotenv>=0:www/py-python-dotenv@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}requests>=0:www/py-requests@${PY_FLAVOR} \
		rg:textproc/ripgrep \
		fd:sysutils/fd

USES=		compiler:c++20-lang nodejs:build,run python:3.11+

SUB_FILES=	pkg-message
SUB_LIST=	PYTHON_PKGNAMEPREFIX=${PYTHON_PKGNAMEPREFIX}

WRKSRC=		${WRKDIR}
WRKSRC_MAIN=	${WRKDIR}/pkg-main
WRKSRC_AI=	${WRKDIR}/pkg-ai
WRKSRC_CORE=	${WRKDIR}/pkg-core
WRKSRC_TUI=	${WRKDIR}/pkg-tui

NODE_MODULES_BASE=	${STAGEDIR}${PREFIX}/lib/node_modules/@earendil-works
PRIME_AGENT_CLI_FILE=	${PREFIX}/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js
PRIME_AGENT_BIN=	${STAGEDIR}${PREFIX}/bin/prime-agent

do-extract:
	@${MKDIR} ${WRKSRC_MAIN} ${WRKSRC_AI} ${WRKSRC_CORE} ${WRKSRC_TUI}
	@${TAR} -xzf ${DISTDIR}/prime-agent-${DISTVERSION}.tgz -C ${WRKSRC_MAIN} --strip-components 1
	@${TAR} -xzf ${DISTDIR}/prime-agent-ai-${DISTVERSION}.tgz -C ${WRKSRC_AI} --strip-components 1
	@${TAR} -xzf ${DISTDIR}/prime-agent-core-${DISTVERSION}.tgz -C ${WRKSRC_CORE} --strip-components 1
	@${TAR} -xzf ${DISTDIR}/prime-agent-tui-${DISTVERSION}.tgz -C ${WRKSRC_TUI} --strip-components 1

do-build:
	@${ECHO_MSG} "===>  Building @earendil-works/pi-ai"
	${MKDIR} ${WRKDIR}/.npm-cache
	cd ${WRKSRC_AI} && ${SETENV} npm_config_cache=${WRKDIR}/.npm-cache \
		npm i --no-fund --no-audit --no-optional --ignore-scripts
	@${ECHO_MSG} "===>  Building @earendil-works/pi-agent-core"
	cd ${WRKSRC_CORE} && ${SETENV} npm_config_cache=${WRKDIR}/.npm-cache \
		npm i --no-fund --no-audit --no-optional --ignore-scripts
	@${ECHO_MSG} "===>  Building @earendil-works/pi-tui"
	cd ${WRKSRC_TUI} && ${SETENV} npm_config_cache=${WRKDIR}/.npm-cache \
		npm i --no-fund --no-audit --no-optional --ignore-scripts
	@${ECHO_MSG} "===>  Building @earendil-works/pi-coding-agent (main)"
	cd ${WRKSRC_MAIN} && ${SETENV} npm_config_cache=${WRKDIR}/.npm-cache \
		npm i --no-fund --no-audit --no-optional --ignore-scripts
	@${ECHO_MSG} "===>  Patching zeromq C++17 compatibility"
	@${REINPLACE_CMD} -e 's/immediate\.contains(option)/immediate.count(option) > 0/g' \
		${WRKSRC_MAIN}/node_modules/zeromq/src/socket.cc
	@${ECHO_MSG} "===>  Patching zeromq CMakeLists.txt (offline project_options stubs)"
	${MKDIR} ${WRKSRC_MAIN}/node_modules/zeromq/.port_stubs
	${PRINTF} '%s\n' \
		'function(project_options)' \
		'endfunction()' \
		'add_library(project_options INTERFACE)' \
		'add_library(project_warnings INTERFACE)' \
		'function(target_link_system_libraries target)' \
		'  target_link_libraries($${target} $${ARGN})' \
		'endfunction()' \
		'function(target_include_system_directories target)' \
		'  target_include_directories($${target} $${ARGN})' \
		'endfunction()' \
		> ${WRKSRC_MAIN}/node_modules/zeromq/.port_stubs/stubs.cmake
	@${REINPLACE_CMD} \
		-e 's#include(FetchContent)#include(.port_stubs/stubs.cmake)#' \
		-e '/# Add project_options from/d' \
		-e '/set(PROJECT_OPTIONS_VERSION/d' \
		-e '/FetchContent_Declare(/,/)/d' \
		-e '/FetchContent_MakeAvailable/d' \
		-e '/_project_options_SOURCE_DIR/d' \
		${WRKSRC_MAIN}/node_modules/zeromq/CMakeLists.txt
	@${ECHO_MSG} "===>  Compiling zeromq native addon (libzmq4 from system)"
	cd ${WRKSRC_MAIN}/node_modules/zeromq && ${SETENV} \
		npm_config_zmq_shared=true \
		CMAKE_CXX_STANDARD=20 \
		PATH=${LOCALBASE}/bin:$${PATH} \
		${LOCALBASE}/bin/node ${WRKSRC_MAIN}/node_modules/cmake-ts/build/main.js build --configs release
	@${ECHO_MSG} "===>  Cleaning cmake artifacts"
	${RM} -r ${WRKSRC_MAIN}/node_modules/zeromq/staging 2>/dev/null || ${TRUE}
	${RM} -rf ${WRKSRC_MAIN}/node_modules/zeromq/.port_stubs 2>/dev/null || ${TRUE}
	${RM} -f ${WRKSRC_MAIN}/node_modules/zeromq/compile_commands.json 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC_MAIN}/node_modules/zeromq -type l -delete 2>/dev/null || ${TRUE}
	${RM} -rf ${WRKSRC_MAIN}/node_modules/zeromq/script 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC_MAIN}/node_modules/zeromq/build -name "*.ninja" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC_MAIN}/node_modules/zeromq/build -name "CMakeCache.txt" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC_MAIN}/node_modules/zeromq/build -name "*.cmake" -delete 2>/dev/null || ${TRUE}
	@${ECHO_MSG} "===>  Cleaning node_modules across components"
	${FIND} ${WRKSRC_MAIN}/node_modules ${WRKSRC_AI}/node_modules ${WRKSRC_CORE}/node_modules ${WRKSRC_TUI}/node_modules -type d -name ".bin" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC_MAIN}/node_modules ${WRKSRC_AI}/node_modules ${WRKSRC_CORE}/node_modules ${WRKSRC_TUI}/node_modules -type l -delete 2>/dev/null || ${TRUE}
	${RM} -f ${WRKSRC_MAIN}/node_modules/.package-lock.json ${WRKSRC_AI}/node_modules/.package-lock.json ${WRKSRC_CORE}/node_modules/.package-lock.json ${WRKSRC_TUI}/node_modules/.package-lock.json 2>/dev/null || ${TRUE}
	# Keep dist/skills for built-in SKILL.md discovery
	${RM} -rf ${WRKSRC_MAIN}/dist/prime-agent-runtime 2>/dev/null || ${TRUE}
	${RM} -rf ${WRKSRC_MAIN}/examples/skills 2>/dev/null || ${TRUE}

do-install:
	@${ECHO_MSG} "===>  Installing components to ${NODE_MODULES_BASE}"
	${MKDIR} ${NODE_MODULES_BASE}/pi-coding-agent
	${MKDIR} ${NODE_MODULES_BASE}/pi-ai
	${MKDIR} ${NODE_MODULES_BASE}/pi-agent-core
	${MKDIR} ${NODE_MODULES_BASE}/pi-tui
	${MKDIR} ${STAGEDIR}${PREFIX}/bin
	# Install pi-coding-agent
	(cd ${WRKSRC_MAIN} && ${COPYTREE_SHARE} dist ${NODE_MODULES_BASE}/pi-coding-agent)
	(cd ${WRKSRC_MAIN} && ${COPYTREE_SHARE} docs ${NODE_MODULES_BASE}/pi-coding-agent)
	(cd ${WRKSRC_MAIN} && ${COPYTREE_SHARE} examples ${NODE_MODULES_BASE}/pi-coding-agent)
	(cd ${WRKSRC_MAIN} && ${COPYTREE_SHARE} node_modules ${NODE_MODULES_BASE}/pi-coding-agent)
	${INSTALL_DATA} ${WRKSRC_MAIN}/package.json ${NODE_MODULES_BASE}/pi-coding-agent/
	${INSTALL_SCRIPT} ${WRKSRC_MAIN}/postinstall.cjs ${NODE_MODULES_BASE}/pi-coding-agent/
	${INSTALL_DATA} ${WRKSRC_MAIN}/README.md ${NODE_MODULES_BASE}/pi-coding-agent/
	${INSTALL_DATA} ${WRKSRC_MAIN}/CHANGELOG.md ${NODE_MODULES_BASE}/pi-coding-agent/
	# Install pi-ai
	(cd ${WRKSRC_AI} && ${COPYTREE_SHARE} dist ${NODE_MODULES_BASE}/pi-ai)
	(cd ${WRKSRC_AI} && ${COPYTREE_SHARE} node_modules ${NODE_MODULES_BASE}/pi-ai)
	${INSTALL_DATA} ${WRKSRC_AI}/package.json ${NODE_MODULES_BASE}/pi-ai/
	${INSTALL_DATA} ${WRKSRC_AI}/README.md ${NODE_MODULES_BASE}/pi-ai/
	# Install pi-agent-core
	(cd ${WRKSRC_CORE} && ${COPYTREE_SHARE} dist ${NODE_MODULES_BASE}/pi-agent-core)
	(cd ${WRKSRC_CORE} && ${COPYTREE_SHARE} node_modules ${NODE_MODULES_BASE}/pi-agent-core)
	${INSTALL_DATA} ${WRKSRC_CORE}/package.json ${NODE_MODULES_BASE}/pi-agent-core/
	${INSTALL_DATA} ${WRKSRC_CORE}/README.md ${NODE_MODULES_BASE}/pi-agent-core/
	# Install pi-tui
	(cd ${WRKSRC_TUI} && ${COPYTREE_SHARE} dist ${NODE_MODULES_BASE}/pi-tui)
	(cd ${WRKSRC_TUI} && ${COPYTREE_SHARE} node_modules ${NODE_MODULES_BASE}/pi-tui)
	${INSTALL_DATA} ${WRKSRC_TUI}/package.json ${NODE_MODULES_BASE}/pi-tui/
	${INSTALL_DATA} ${WRKSRC_TUI}/README.md ${NODE_MODULES_BASE}/pi-tui/
	# Install CLI wrapper
	@${ECHO_MSG} "===>  Installing CLI wrapper"
	${PRINTF} '#!/bin/sh\nPRIME_AGENT_KERNEL_PYTHON="${PYTHON_CMD}" \\\nPRIME_AGENT_BOOTSTRAP_KERNEL_ON_INSTALL=0 \\\nPRIME_AGENT_BOOTSTRAP_TOOLS_ON_INSTALL=0 \\\nexec ${LOCALBASE}/bin/node ${PRIME_AGENT_CLI_FILE} "$$@"\n' > ${WRKDIR}/prime-agent
	${INSTALL_SCRIPT} ${WRKDIR}/prime-agent ${PRIME_AGENT_BIN}

post-install:
	@${ECHO_MSG} "===>  Pruning development artifacts and leftover patch backups"
	${FIND} ${NODE_MODULES_BASE} -type f \( -name "*.orig" -o -name "*.rej" \) -delete 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -name "*.d.ts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -name "*.d.cts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -name "*.d.mts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -name "*.map" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -name "*.ts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -type d -name "test" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -type d -name "__tests__" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -name "*.node" ! -path "*/Release/*" ! -path "*/freebsd/*" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NODE_MODULES_BASE} -depth -type d -empty -delete 2>/dev/null || ${TRUE}

	@${ECHO_MSG} "===>  Generating dynamic PLIST"
	@cd ${STAGEDIR}${PREFIX} && \
		${FIND} bin/prime-agent lib/node_modules/@earendil-works \( -type f -o -type l \) | \
		${SORT} -u >> ${TMPPLIST}

.include <bsd.port.mk>
