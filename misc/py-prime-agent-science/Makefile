PORTNAME=	prime-agent-science
DISTVERSION=	0.7.3
CATEGORIES=	misc python # machine-learning
MASTER_SITES=	# none
PKGNAMEPREFIX=	${PYTHON_PKGNAMEPREFIX}
DISTFILES=	# none — meta-port (no source, no build)

MAINTAINER=	pr9000@tutamail.com
COMMENT=	Meta-port: scientific stack dependencies for Prime Agent
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

RUN_DEPENDS=	${PYTHON_PKGNAMEPREFIX}matplotlib>=0:math/py-matplotlib@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}numpy>=0:math/py-numpy@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}pandas>=0:math/py-pandas@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}prime-agent-runtime>0:misc/py-prime-agent-runtime@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}scipy>=0:science/py-scipy@${PY_FLAVOR}

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
