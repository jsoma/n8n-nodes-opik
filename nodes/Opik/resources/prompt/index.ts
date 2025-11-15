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
		displayName: 'Prompt Text',
		name: 'promptText',
		type: 'string',
		default: '',
		noDataExpression: true,
		description: 'Read-only preview of the selected prompt version',
		hint: 'This field updates automatically when you pick a prompt version',
		typeOptions: {
			rows: 6,
			editorIsReadOnly: true,
			loadOptionsMethod: 'getPromptText',
			loadOptionsDependsOn: ['promptId', 'promptVersion'],
		},
		displayOptions: {
			show: showPrompt,
		},
	},
];
