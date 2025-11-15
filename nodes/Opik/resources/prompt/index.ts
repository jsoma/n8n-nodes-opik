import type { INodeProperties } from 'n8n-workflow';

const showPrompt = {
	resource: ['prompt'],
};

export const promptDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showPrompt,
		},
		options: [
			{
				name: 'Get Prompt',
				value: 'get',
				action: 'Get a prompt',
				description: 'Fetch a named prompt and optionally a specific version',
					routing: {
						request: {
							method: 'GET',
							url: '={{!$parameter.promptVersion || $parameter.promptVersion === "latest" ? `/v1/private/prompts/${$parameter.promptId}` : `/v1/private/prompts/versions/${$parameter.promptVersion}`}}',
						},
					},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Prompt Name or ID',
		name: 'promptId',
		type: 'options',
		required: true,
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getPrompts',
		},
		displayOptions: {
			show: showPrompt,
		},
	},
	{
		displayName: 'Prompt Version Name or ID',
		name: 'promptVersion',
		type: 'options',
		default: 'latest',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		options: [
			{
				name: 'Latest Version (Current)',
				value: 'latest',
			},
		],
		typeOptions: {
			loadOptionsMethod: 'getPromptVersions',
			loadOptionsDependsOn: ['promptId'],
		},
		displayOptions: {
			show: showPrompt,
		},
	},
];
