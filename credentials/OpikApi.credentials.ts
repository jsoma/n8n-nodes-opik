import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class OpikApi implements ICredentialType {
	name = 'opikApi';

	displayName = 'Opik API';

	documentationUrl = 'https://github.com/jsoma/n8n-nodes-opik#credentials';

	icon: Icon = 'file:opik.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://www.comet.com/opik/api',
			required: true,
			placeholder: 'https://your-opik-instance/api',
			description: 'Base URL for your Opik deployment (cloud or self-hosted, include the /api suffix)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Personal or workspace API key (required for Opik Cloud, optional for self-hosted instances that allow anonymous access)',
		},
		{
			displayName: 'Workspace Name',
			name: 'workspace',
			type: 'string',
			default: '',
			description:
				'Optional default workspace/project namespace. Set this when you want to scope trace creation without providing project_name on every request.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey ? `Bearer ${$credentials.apiKey}` : undefined}}',
				'Comet-Workspace': '={{$credentials.workspace || undefined}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/health',
			method: 'GET',
		},
	};
}
