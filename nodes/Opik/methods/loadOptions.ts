import type {
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

type OpikPromptListResponse = {
	content?: Array<{
		id: string;
		name: string;
		version_count?: number;
		created_at?: string;
		last_updated_at?: string;
	}>;
};

type OpikPromptVersionsResponse = {
	content?: Array<{
		id: string;
		template?: string;
		create_at?: string;
		created_at?: string;
		commit?: string;
		created_by?: string;
	}>;
};

type OpikProjectListResponse = {
	content?: Array<{
		id: string;
		name: string;
		visibility?: string;
	}>;
};

async function requestOpik(
	this: ILoadOptionsFunctions,
	options: IHttpRequestOptions,
): Promise<unknown> {
	const credentials = (await this.getCredentials('opikApi')) as { baseUrl: string };
	const baseURL = credentials.baseUrl.replace(/\/+$/, '');

	return this.helpers.httpRequestWithAuthentication.call(
		this,
		'opikApi',
		{
			baseURL,
			...options,
		},
	) as Promise<unknown>;
}

export async function getPrompts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = (await requestOpik.call(this, {
		method: 'GET',
		url: '/v1/private/prompts',
		qs: {
			size: 200,
			page: 1,
		},
	})) as OpikPromptListResponse;

	const prompts = Array.isArray(response.content) ? response.content : [];

	return prompts.map((prompt) => ({
		name: prompt.name ?? prompt.id,
		value: prompt.id,
		description: prompt.version_count
			? `${prompt.version_count} version${prompt.version_count === 1 ? '' : 's'}`
			: undefined,
	}));
}

export async function getPromptVersions(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const promptId = this.getNodeParameter('promptId', 0) as string;

	if (!promptId) {
		return [];
	}

	const response = (await requestOpik.call(this, {
		method: 'GET',
		url: `/v1/private/prompts/${promptId}/versions`,
		qs: {
			size: 50,
			page: 1,
		},
	})) as OpikPromptVersionsResponse;

	const versions = Array.isArray(response.content) ? response.content : [];

	const returnData: INodePropertyOptions[] = [];

	returnData.push({
		name: 'Latest Version (Current)',
		value: 'latest',
	});

	for (const [index, version] of versions.entries()) {
		if (!version.id) {
			continue;
		}
		const createdAt = version.created_at || version.create_at;
		const labelParts: string[] = [];
		if (createdAt) {
			labelParts.push(new Date(createdAt).toLocaleString());
		}
		if (version.commit) {
			labelParts.push(`Commit ${version.commit}`);
		}

		returnData.push({
			name: labelParts.length
				? labelParts.join(' · ')
				: `Version ${versions.length - index}`,
			value: version.id,
			description: (version as { change_description?: string }).change_description?.trim() || undefined,
		});
	}

	return returnData;
}

export async function getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = (await requestOpik.call(this, {
		method: 'GET',
		url: '/v1/private/projects',
		qs: {
			size: 200,
			page: 1,
		},
	})) as OpikProjectListResponse;

	const projects = Array.isArray(response.content) ? response.content : [];

	return projects.map((project) => ({
		name: project.name,
		value: project.name,
		description: project.id ? `ID: ${project.id}` : undefined,
	}));
}

export async function getPromptText(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const promptId = this.getNodeParameter('promptId', 0) as string;
	if (!promptId) return [];

	const promptVersion = this.getNodeParameter('promptVersion', 0) as string;

	let template = '';

	const useLatest = !promptVersion || promptVersion === 'latest';

	if (useLatest) {
		const response = (await requestOpik.call(this, {
			method: 'GET',
			url: `/v1/private/prompts/${promptId}`,
		})) as { latest_version?: { template?: string } };
		template = response.latest_version?.template ?? '';
	} else {
		const response = (await requestOpik.call(this, {
			method: 'GET',
			url: `/v1/private/prompts/versions/${promptVersion}`,
		})) as { template?: string };
		template = response.template ?? '';
	}

	const normalized = template || '(Prompt has no template)';

	return [
		{
			name: normalized,
			value: normalized,
		},
	];
}
