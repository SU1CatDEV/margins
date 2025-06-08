export function flashAfterScroll(element, callback) {
    var scrollTimeout;

    const handleScroll = (e) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            callback(element);
            removeEventListener('scroll', handleScroll);
        }, 100);
    }

    const isElementInViewport = (elem) => {
        const rect = elem.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    if (isElementInViewport(element)) {
        callback(element);
        removeEventListener('scroll', handleScroll);
    } else {
        addEventListener('scroll', handleScroll);
    }

    element.scrollIntoView({ behavior: 'smooth' });
}

export function trimToLength(str, len) {
    if (str.length > len-3) {
        str = str.slice(0, len-3);
        str += "...";
    }
    return str;
}

export function averageArray(arr) {
    if (arr.length === 0) {
        return 0;
    }
    return arr.reduce((partial, a) => partial + a, 0) / arr.length;
}

export async function getMore(type, page, perPage, skip = 0) {
    return await fetch(`/load`, {
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({type, page, perPage, skip}),
    })
    .then(response => response.json())
    .catch((e) => {
        return e;
    });
}