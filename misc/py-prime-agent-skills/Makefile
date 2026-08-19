PORTNAME=	prime-agent-skills
DISTVERSION=	0.7.3
CATEGORIES=	misc python # machine-learning
MASTER_SITES=	# none
PKGNAMEPREFIX=	${PYTHON_PKGNAMEPREFIX}
DISTFILES=	# none — meta-port (no source, no build)

MAINTAINER=	pr9000@tutamail.com
COMMENT=	Meta-port: all 11 Python skills for Prime Agent
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

RUN_DEPENDS=	${PYTHON_PKGNAMEPREFIX}prime-agent-skill-agent-message>0:misc/py-prime-agent-skill-agent-message@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-agent-observe>0:misc/py-prime-agent-skill-agent-observe@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-attach-image>0:misc/py-prime-agent-skill-attach-image@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-compact>0:misc/py-prime-agent-skill-compact@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-edit>0:misc/py-prime-agent-skill-edit@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-goal>0:misc/py-prime-agent-skill-goal@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-linear>0:misc/py-prime-agent-skill-linear@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-notion>0:misc/py-prime-agent-skill-notion@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-refine>0:misc/py-prime-agent-skill-refine@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-rlm-heartbeat>0:misc/py-prime-agent-skill-rlm-heartbeat@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-skill-websearch>0:misc/py-prime-agent-skill-websearch@${PY_FLAVOR} \
		prime-agent-skills-docs>0:misc/prime-agent-skills-docs

USES=		python:3.10+
USE_PYTHON=	flavors

NO_BUILD=	yes
NO_ARCH=	yes

# Meta-port has no WRKSRC (no source to install).
# Provide a no-op do-install so the framework's install-license
# target (which installs LICENSE files to STAGEDIR) still runs
# via prerequisite injection, but the default
# "cd ${WRKSRC} && make install" is not used.
do-install:
	@${DO_NADA}

.include <bsd.port.mk>
