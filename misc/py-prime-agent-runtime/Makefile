PORTNAME=	prime-agent-runtime
# Upstream pyproject.toml defines version 0.1.0, while the monorepo release tag is v0.7.3
DISTVERSION=	0.1.0
CATEGORIES=	misc python # machine-learning
PKGNAMEPREFIX=	${PYTHON_PKGNAMEPREFIX}

MAINTAINER=	pr9000@tutamail.com
COMMENT=	Kernel-side runtime shim for Prime Agent (rlm module)
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

BUILD_DEPENDS=	${PYTHON_PKGNAMEPREFIX}hatchling>=1.0:devel/py-hatchling@${PY_FLAVOR}

RUN_DEPENDS=	${PYTHON_PKGNAMEPREFIX}ipykernel>=6.0:devel/py-ipykernel@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}nest-asyncio2>=0:devel/py-nest-asyncio2@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}tyro>=1.0.15:devel/py-tyro@${PY_FLAVOR}

USES=		python:3.10+
USE_PYTHON=	autoplist concurrent pep517
WRKSRC_SUBDIR=	prime-agent-runtime

USE_GITHUB=	yes
GH_ACCOUNT=	PrimeIntellect-ai
GH_PROJECT=	prime-agent
GH_TAGNAME=	v0.7.3

NO_ARCH=	yes

.include <bsd.port.mk>
