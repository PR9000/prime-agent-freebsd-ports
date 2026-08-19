PORTNAME=	prime-agent-ai
DISTVERSION=	0.7.3
CATEGORIES=	misc # machine-learning
#MASTER_SITES=	https://github.com/PrimeIntellect-ai/prime-agent/releases/download/v${DISTVERSION}/
MASTER_SITES=	LOCAL/

MAINTAINER=	pr9000@tutamail.com
COMMENT=	AI provider abstraction layer for Prime Agent
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

BUILD_DEPENDS=	npm-node22>0:www/npm-node22
RUN_DEPENDS=	node:www/node22

USES=		nodejs:22,build,run tar:tgz
NO_ARCH=	yes

WRKSRC=		${WRKDIR}/package

NODE_MODULES_DIR=	${STAGEDIR}${PREFIX}/lib/node_modules
NPM_PACKAGE=		@earendil-works/pi-ai
NPM_PACKAGE_DIR=	${NODE_MODULES_DIR}/${NPM_PACKAGE}
PI_AI_CLI_FILE=		${PREFIX}/lib/node_modules/${NPM_PACKAGE}/dist/cli.js
PI_AI_BIN=		${STAGEDIR}${PREFIX}/bin/pi-ai

do-build:
	@${ECHO_MSG} "===>  npm dependency resolution (11 deps, no optional, no scripts)"
	cd ${WRKSRC} && ${SETENV} npm_config_cache=${WRKDIR}/.npm-cache \
		npm i --no-fund --no-audit --no-optional --ignore-scripts

do-install:
	@${ECHO_MSG} "===>  Placing files to ${NPM_PACKAGE_DIR}"
	${FIND} ${WRKSRC}/node_modules -type d -name ".bin" -exec ${RM} -r {} + 2>/dev/null || ${TRUE}
	${RM} -f ${WRKSRC}/node_modules/.package-lock.json 2>/dev/null || ${TRUE}
	${MKDIR} ${NPM_PACKAGE_DIR}
	(cd ${WRKSRC} && ${COPYTREE_SHARE} dist ${NPM_PACKAGE_DIR})
	(cd ${WRKSRC} && ${COPYTREE_SHARE} node_modules ${NPM_PACKAGE_DIR})
	${INSTALL_DATA} ${WRKSRC}/package.json ${NPM_PACKAGE_DIR}/
	${INSTALL_DATA} ${WRKSRC}/README.md ${NPM_PACKAGE_DIR}/
	${MKDIR} ${STAGEDIR}${PREFIX}/bin
	${PRINTF} '#!/bin/sh\nexec ${LOCALBASE}/bin/node ${PI_AI_CLI_FILE} "$$@"\n' > ${WRKDIR}/pi-ai
	${INSTALL_SCRIPT} ${WRKDIR}/pi-ai ${PI_AI_BIN}

.include <bsd.port.mk>
