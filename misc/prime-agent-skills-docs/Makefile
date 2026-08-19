PORTNAME=	prime-agent-skills-docs
DISTVERSION=	0.7.3
CATEGORIES=	misc
#MASTER_SITES=	https://github.com/PrimeIntellect-ai/prime-agent/releases/download/v${DISTVERSION}/
MASTER_SITES=	LOCAL/
DISTFILES=	prime-agent-${DISTVERSION}.tgz

MAINTAINER=	pr9000@tutamail.com
COMMENT=	Documentation and prompt-based skills for Prime Agent
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

USES=		tar:tgz
NO_ARCH=	yes
NO_BUILD=	yes

WRKSRC=		${WRKDIR}/package/skills

PRIME_SKILLS_DIR=	${STAGEDIR}${PREFIX}/share/prime-agent/skills
PRIME_CLI_SKILLS_DIR=	${STAGEDIR}${PREFIX}/lib/node_modules/@earendil-works/pi-coding-agent/dist/skills

do-install:
	${MKDIR} ${PRIME_SKILLS_DIR}/prime-intellect
	${MKDIR} ${PRIME_SKILLS_DIR}/skill-creator
	${INSTALL_DATA} ${WRKSRC}/prime-intellect/SKILL.md ${PRIME_SKILLS_DIR}/prime-intellect/
	(cd ${WRKSRC}/prime-intellect && ${COPYTREE_SHARE} references ${PRIME_SKILLS_DIR}/prime-intellect)
	${INSTALL_DATA} ${WRKSRC}/skill-creator/SKILL.md ${PRIME_SKILLS_DIR}/skill-creator/
	(cd ${WRKSRC}/skill-creator && ${COPYTREE_SHARE} references ${PRIME_SKILLS_DIR}/skill-creator)
	${MKDIR} ${PRIME_CLI_SKILLS_DIR}
	${RLN} ${PRIME_SKILLS_DIR}/prime-intellect ${PRIME_CLI_SKILLS_DIR}/prime-intellect
	${RLN} ${PRIME_SKILLS_DIR}/skill-creator ${PRIME_CLI_SKILLS_DIR}/skill-creator

.include <bsd.port.mk>
