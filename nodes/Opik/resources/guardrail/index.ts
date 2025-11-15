import type { INodeProperties } from 'n8n-workflow';

const showGuardrail = {
	resource: ['guardrail'],
};

const showTopic = {
	...showGuardrail,
	guardrailType: ['topic'],
};

const showPii = {
	...showGuardrail,
	guardrailType: ['pii'],
};

export const guardrailDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showGuardrail,
		},
		options: [
			{
				name: 'Check Guardrails',
				value: 'check',
				action: 'Check guardrails',
				description: 'Validate content against PII detection or topic guardrails',
					routing: {
						request: {
							method: 'POST',
							url: '/v1/private/guardrails/check',
							body: {
								project_name: '={{$parameter.projectName}}',
							},
						},
					},
				},
		],
		default: 'check',
	},
	{
		displayName: 'Text',
		name: 'guardrailText',
		type: 'string',
		required: true,
		default: '',
		typeOptions: {
			rows: 4,
		},
		description: 'Content to validate',
		displayOptions: {
			show: showGuardrail,
		},
		routing: {
			send: {
				type: 'body',
				property: 'text',
			},
		},
	},
	{
		displayName: 'Guardrail Type',
		name: 'guardrailType',
		type: 'options',
		options: [
			{ name: 'PII Detection', value: 'pii' },
			{ name: 'Topic Moderation', value: 'topic' },
		],
		default: 'pii',
		displayOptions: {
			show: showGuardrail,
		},
		routing: {
			send: {
				type: 'body',
				property: 'guardrail_type',
			},
		},
	},
	{
		displayName: 'Allowed Topics',
		name: 'allowedTopics',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description: 'Only permit these topics',
		displayOptions: {
			show: showTopic,
		},
		routing: {
			send: {
				type: 'body',
				property: 'configuration.allowed_topics',
			},
		},
	},
	{
		displayName: 'Disallowed Topics',
		name: 'disallowedTopics',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description: 'Block these topics',
		displayOptions: {
			show: showTopic,
		},
		routing: {
			send: {
				type: 'body',
				property: 'configuration.disallowed_topics',
			},
		},
	},
	{
		displayName: 'PII Entities',
		name: 'piiEntities',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: ['name', 'email', 'phone', 'address', 'ssn', 'credit_card'],
		description: 'Entity list to redact/detect',
		displayOptions: {
			show: showPii,
		},
		routing: {
			send: {
				type: 'body',
				property: 'configuration.entities',
			},
		},
	},
];
