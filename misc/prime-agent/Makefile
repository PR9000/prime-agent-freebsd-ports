PORTNAME=	prime-agent
DISTVERSION=	0.7.3
CATEGORIES=	misc python # machine-learning
#MASTER_SITES=	https://github.com/PrimeIntellect-ai/prime-agent/releases/download/v${DISTVERSION}/
MASTER_SITES=	LOCAL/

MAINTAINER=	pr9000@tutamail.com
COMMENT=	Self-improving coding and agent with IPython-backed kernel
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

BUILD_DEPENDS=	cmake:devel/cmake \
		ninja:devel/ninja \
		pkgconf:devel/pkgconf \
		libzmq4>0:net/libzmq4 \
		npm-node22>0:www/npm-node22

RUN_DEPENDS=	${PYTHON_PKGNAMEPREFIX}dill>=0.3:devel/py-dill@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}ipykernel>=6.0:devel/py-ipykernel@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}lxml>=0:devel/py-lxml@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}nest-asyncio2>=1.0:devel/py-nest-asyncio2@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}pydantic2>=2.0:devel/py-pydantic2@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}pyyaml>=0:devel/py-pyyaml@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}tyro>=1.0.15:devel/py-tyro@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}pillow>=0:graphics/py-pillow@${PY_FLAVOR} \
		prime-agent-ai>0:misc/prime-agent-ai \
		prime-agent-core>0:misc/prime-agent-core \
		prime-agent-tui>0:misc/prime-agent-tui \
		${PYTHON_PKGNAMEPREFIX}mcp>=0:misc/py-mcp@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-runtime>0:misc/py-prime-agent-runtime@${PY_FLAVOR} \
		libzmq4>0:net/libzmq4 \
		${PYTHON_PKGNAMEPREFIX}pyzmq>=0:net/py-pyzmq@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}tomli>=0:textproc/py-tomli@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}beautifulsoup>=0:www/py-beautifulsoup@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}httpx>=0:www/py-httpx@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}python-dotenv>=0:www/py-python-dotenv@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}requests>=0:www/py-requests@${PY_FLAVOR} \
		rg:textproc/ripgrep \
		fd:misc/fd-find

USES=		compiler:c++20-lang nodejs:22,build,run python:3.10+ tar:tgz

WRKSRC=		${WRKDIR}/package

NODE_MODULES_DIR=	${STAGEDIR}${PREFIX}/lib/node_modules
NPM_PACKAGE=		@earendil-works/pi-coding-agent
NPM_PACKAGE_DIR=	${NODE_MODULES_DIR}/${NPM_PACKAGE}
PRIME_AGENT_CLI_FILE=	${PREFIX}/lib/node_modules/${NPM_PACKAGE}/dist/bundle/cli.js
PRIME_AGENT_BIN=		${STAGEDIR}${PREFIX}/bin/prime-agent

do-build:
	@${ECHO_MSG} "===>  npm install (scripts ignored)"
	${MKDIR} ${WRKDIR}/.npm-cache
	cd ${WRKSRC} && ${SETENV} npm_config_cache=${WRKDIR}/.npm-cache \
		npm i --no-fund --no-audit --no-optional --ignore-scripts
	@${ECHO_MSG} "===>  Patching zeromq C++17 compatibility"
	@${REINPLACE_CMD} -e 's/immediate\.contains(option)/immediate.count(option) > 0/g' \
		${WRKSRC}/node_modules/zeromq/src/socket.cc
	@${ECHO_MSG} "===>  Patching zeromq CMakeLists.txt (offline project_options stubs)"
	${MKDIR} ${WRKSRC}/node_modules/zeromq/.port_stubs
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
		> ${WRKSRC}/node_modules/zeromq/.port_stubs/stubs.cmake
	@${REINPLACE_CMD} \
		-e 's#include(FetchContent)#include(.port_stubs/stubs.cmake)#' \
		-e '/# Add project_options from/d' \
		-e '/set(PROJECT_OPTIONS_VERSION/d' \
		-e '/FetchContent_Declare(/,/)/d' \
		-e '/FetchContent_MakeAvailable/d' \
		-e '/_project_options_SOURCE_DIR/d' \
		${WRKSRC}/node_modules/zeromq/CMakeLists.txt
	@${ECHO_MSG} "===>  zeromq v6.6.0: npm_config_zmq_shared=true links to system libzmq4"
	@${ECHO_MSG} "===>  Compiling zeromq native addon (libzmq4 from system)"
	cd ${WRKSRC}/node_modules/zeromq && ${SETENV} \
		npm_config_zmq_shared=true \
		CMAKE_CXX_STANDARD=20 \
		PATH=${LOCALBASE}/bin:$${PATH} \
		${LOCALBASE}/bin/node ${WRKSRC}/node_modules/cmake-ts/build/main.js nativeonly
	@${ECHO_MSG} "===>  Cleaning cmake artifacts"
	${RM} -r ${WRKSRC}/node_modules/zeromq/staging 2>/dev/null || ${TRUE}
	${RM} -f ${WRKSRC}/node_modules/zeromq/compile_commands.json 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules/zeromq -type l -delete 2>/dev/null || ${TRUE}
	${RM} -rf ${WRKSRC}/node_modules/zeromq/script 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules/zeromq/build -name "*.ninja" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules/zeromq/build -name "CMakeCache.txt" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules/zeromq/build -name "*.cmake" -delete 2>/dev/null || ${TRUE}
	@${ECHO_MSG} "===>  Cleaning node_modules (symlinks, .bin, lock)"
	${FIND} ${WRKSRC}/node_modules -type d -name ".bin" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules -type l -delete 2>/dev/null || ${TRUE}
	${RM} -f ${WRKSRC}/node_modules/.package-lock.json 2>/dev/null || ${TRUE}
	@${ECHO_MSG} "===>  Pruning non-runtime node_modules files (types, maps, source, tests)"
	${FIND} ${WRKSRC}/node_modules -name "*.d.ts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules -name "*.d.cts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules -name "*.js.map" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules -name "*.cjs.map" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules -name "*.ts" -not -name "*.d.ts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules -type d -name "test" -not -path "*/node_modules/*" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules -type d -name "__tests__" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${FIND} ${WRKSRC}/node_modules -depth -type d -empty -delete 2>/dev/null || ${TRUE}
	@${ECHO_MSG} "===>  Removing bundled Python skills and runtime (packaged in dedicated ports)"
	${RM} -rf ${WRKSRC}/dist/skills ${WRKSRC}/dist/prime-agent-runtime 2>/dev/null || ${TRUE}
	${RM} -rf ${WRKSRC}/examples/skills 2>/dev/null || ${TRUE}

do-install:
	@${ECHO_MSG} "===>  Placing files to ${NPM_PACKAGE_DIR}"
	${MKDIR} ${NPM_PACKAGE_DIR}
	${MKDIR} ${STAGEDIR}${PREFIX}/bin
	(cd ${WRKSRC} && ${COPYTREE_SHARE} dist ${NPM_PACKAGE_DIR})
	(cd ${WRKSRC} && ${COPYTREE_SHARE} docs ${NPM_PACKAGE_DIR})
	(cd ${WRKSRC} && ${COPYTREE_SHARE} examples ${NPM_PACKAGE_DIR})
	(cd ${WRKSRC} && ${COPYTREE_SHARE} node_modules ${NPM_PACKAGE_DIR})
	${INSTALL_DATA} ${WRKSRC}/package.json ${NPM_PACKAGE_DIR}/
	${INSTALL_SCRIPT} ${WRKSRC}/postinstall.cjs ${NPM_PACKAGE_DIR}/
	${INSTALL_DATA} ${WRKSRC}/README.md ${NPM_PACKAGE_DIR}/
	${INSTALL_DATA} ${WRKSRC}/CHANGELOG.md ${NPM_PACKAGE_DIR}/
	@${ECHO_MSG} "===>  Installing CLI wrapper"
	${PRINTF} '#!/bin/sh\nPRIME_AGENT_KERNEL_PYTHON="${PYTHON_CMD}" \\\nPRIME_AGENT_BOOTSTRAP_KERNEL_ON_INSTALL=0 \\\nPRIME_AGENT_BOOTSTRAP_TOOLS_ON_INSTALL=0 \\\nexec ${LOCALBASE}/bin/node ${PRIME_AGENT_CLI_FILE} "$$@"\n' > ${WRKDIR}/prime-agent
	${INSTALL_SCRIPT} ${WRKDIR}/prime-agent ${PRIME_AGENT_BIN}

post-install:
	@${ECHO_MSG} "===>  Pruning non-runtime files from stage dir (dist, docs, examples, node_modules)"
	${FIND} ${NPM_PACKAGE_DIR} -name "*.d.ts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NPM_PACKAGE_DIR} -name "*.d.cts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NPM_PACKAGE_DIR} -name "*.js.map" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NPM_PACKAGE_DIR} -name "*.cjs.map" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NPM_PACKAGE_DIR} -name "*.ts" -delete 2>/dev/null || ${TRUE}
	${FIND} ${NPM_PACKAGE_DIR} -type d -name "test" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${FIND} ${NPM_PACKAGE_DIR} -type d -name "__tests__" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${FIND} ${NPM_PACKAGE_DIR} -depth -type d -empty -delete 2>/dev/null || ${TRUE}

.include <bsd.port.mk>
