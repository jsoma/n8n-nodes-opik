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
						url: '=/v1/private/prompts/by-name/{{$parameter.promptName}}',
					},
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Prompt Name',
		name: 'promptName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the prompt saved in Opik',
		displayOptions: {
			show: showPrompt,
		},
	},
	{
		displayName: 'Options',
		name: 'promptOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: showPrompt,
		},
		options: [
			{
				displayName: 'Version',
				name: 'version',
				type: 'number',
				default: 0,
				description: 'Fetch a specific version instead of the latest',
				routing: {
					send: {
						type: 'query',
						property: 'version',
					},
				},
			},
		],
	},
];
