PORTNAME=	prime-agent-runtime
# Upstream pyproject.toml defines version 0.1.0, while the monorepo release tag is v0.8.1
DISTVERSION=	0.1.0
CATEGORIES=	misc python
MASTER_SITES=	https://github.com/PrimeIntellect-ai/prime-agent/releases/download/v${PRIME_VERSION}/
PKGNAMEPREFIX=	${PYTHON_PKGNAMEPREFIX}
DISTNAME=	prime-agent-${PRIME_VERSION}

MAINTAINER=	pr9000@tutamail.com
COMMENT=	Kernel-side runtime shim for Prime Agent (rlm module)
WWW=		https://github.com/PrimeIntellect-ai/prime-agent

LICENSE=	MIT
LICENSE_FILE=	${FILESDIR}/LICENSE

BUILD_DEPENDS=	${PYTHON_PKGNAMEPREFIX}hatchling>=1.0:devel/py-hatchling@${PY_FLAVOR}
RUN_DEPENDS=	${PYTHON_PKGNAMEPREFIX}ipykernel>=6.0:devel/py-ipykernel@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}mcp>=0:misc/py-mcp@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}nest-asyncio2>=0:devel/py-nest-asyncio2@${PY_FLAVOR} \
		${PYTHON_PKGNAMEPREFIX}tyro>=1.0.16:devel/py-tyro@${PY_FLAVOR}

USES=		python:3.11+ tar:tgz
USE_PYTHON=	autoplist concurrent pep517

WRKSRC=		${WRKDIR}/package/dist/prime-agent-runtime
NO_ARCH=	yes

PRIME_VERSION=	0.8.1

.include <bsd.port.mk>
