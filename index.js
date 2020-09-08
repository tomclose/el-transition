export async function enter(element, animation=null) {
    element.classList.remove('hidden')
    await transition('enter', element, animation)
}

export async function leave(element, animation=null) {
    await transition('leave', element, animation)
    element.classList.add('hidden')
}

async function transition(direction, element, animation) {
    const dataset = element.dataset
    const animationClass = animation ? `${animation}-${direction}` : direction
    let transition = `transition${direction.charAt(0).toUpperCase() + direction.slice(1)}`
    const genesis = dataset[transition] ? dataset[transition].split(" ") : [animationClass]
    const start = dataset[`${transition}Start`] ? dataset[`${transition}Start`].split(" ") : [`${animationClass}-start`]
    const end = dataset[`${transition}End`] ? dataset[`${transition}End`].split(" ") : [`${animationClass}-end`]
    
    addClasses(element, genesis)
    addClasses(element, start)
    await nextFrame()
    removeClasses(element, start)
    addClasses(element, end);
    await afterTransition(element)
    removeClasses(element, end)
    addClasses(element, genesis)
}

function addClasses(element, classes) {
    element.classList.add(...classes)
}

function removeClasses(element, classes) {
    element.classList.remove(...classes)
}

function nextFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve)
        });
    });
}

function afterTransition(element) {
    return new Promise(resolve => {
        const duration = Number(
            getComputedStyle(element)
                .transitionDuration
                .replace('s', '')
        ) * 1000;
        setTimeout(() => {
            resolve()
        }, duration)
    });
}