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
						url: '={{!$parameter.promptVersion ? `/v1/private/prompts/${$parameter.promptId}` : `/v1/private/prompts/${$parameter.promptId}/versions/${$parameter.promptVersion}`}}',
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
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		options: [
			{
				name: 'Latest Version (Current)',
				value: '',
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
	{
		displayName: 'Prompt Text Name or ID',
		name: 'promptText',
		type: 'options',
		default: '',
		noDataExpression: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: 'Prompt text preview',
		typeOptions: {
			loadOptionsMethod: 'getPromptText',
			loadOptionsDependsOn: ['promptId', 'promptVersion'],
			rows: 6,
		},
		displayOptions: {
			show: showPrompt,
		},
	},
];
