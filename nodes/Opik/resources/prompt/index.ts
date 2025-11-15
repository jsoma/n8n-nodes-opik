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
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								enabled:
									'={{!$parameter.promptVersion || $parameter.promptVersion === "latest"}}',
								properties: {
									property: 'latest_version',
								},
							},
							{
								type: 'setKeyValue',
								enabled: '={{$parameter.generateN8nTemplate !== false}}',
								properties: {
									n8n_template:
										'={{$json.template ? $json.template.replace(/{{\\s*([^{}\\s]+)\\s*}}/g, function(match, name) { return "{{$json[\\"" + name + "\\"]}}"; }) : undefined}}',
								},
							},
						],
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
	{
		displayName: 'Generate N8n Template',
		name: 'generateN8nTemplate',
		type: 'boolean',
		default: true,
		description:
			'Whether to add an `n8n_template` field with {{ ... }} placeholders converted to JSON expressions (for example <code>{{$&#106;&#115;&#111;&#110;["..."]}}</code>).',
		displayOptions: {
			show: showPrompt,
		},
	},
];
