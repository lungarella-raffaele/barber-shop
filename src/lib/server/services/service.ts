export abstract class Service {
	private static instances = new Map<string, Service>();

	constructor() {}

	public static get<T extends Service>(this: new () => T): T {
		const className = this.name;

		if (!Service.instances.has(className)) {
			Service.instances.set(className, new this());
		}

		return Service.instances.get(className) as T;
	}
}
