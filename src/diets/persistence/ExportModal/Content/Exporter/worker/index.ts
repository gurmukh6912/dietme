


const getWorker = () => {
	return new ComlinkWorker<typeof import('./worker')>(new URL('./worker', import.meta.url), {/* normal Worker options*/ })
}


export default getWorker
