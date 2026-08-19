PORTNAME=	prime-agent-core
DISTVERSION=	0.7.3
CATEGORIES=	misc # machine-learning
#MASTER_SITES=	https://github.com/PrimeIntellect-ai/prime-agent/releases/download/v${DISTVERSION}/
MASTER_SITES=	LOCAL/

MAINTAINER=	pr9000@tutamail.com
COMMENT=	Core agent engine with transport abstraction for Prime Agent
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

BUILD_DEPENDS=	npm-node22>0:www/npm-node22
RUN_DEPENDS=	prime-agent-ai>0:misc/prime-agent-ai

USES=		nodejs:22,build,run tar:tgz
NO_ARCH=	yes

WRKSRC=		${WRKDIR}/package

NODE_MODULES_DIR=	${STAGEDIR}${PREFIX}/lib/node_modules
NPM_PACKAGE=		@earendil-works/pi-agent-core
NPM_PACKAGE_DIR=	${NODE_MODULES_DIR}/${NPM_PACKAGE}

post-extract:
	@${ECHO_MSG} "===>  Removing R2 URL dep (@earendil-works/pi-ai — provided by port)"
	@${REINPLACE_CMD} -e '/@earendil-works\/pi-ai/d' ${WRKSRC}/package.json

do-build:
	@${ECHO_MSG} "===>  npm dependency resolution (1 dep: typebox, no R2 URL, no scripts)"
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

.include <bsd.port.mk>
