import type { INodeProperties } from 'n8n-workflow';

const showFeedback = {
	resource: ['feedback'],
};

export const feedbackDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showFeedback,
		},
		options: [
			{
				name: 'Log Feedback',
				value: 'score',
				action: 'Log feedback',
				description: 'Attach a numeric feedback score to a trace or span',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/private/feedback',
					},
				},
			},
		],
		default: 'score',
	},
	{
		displayName: 'Entity Type',
		name: 'feedbackEntityType',
		type: 'options',
		options: [
			{ name: 'Trace', value: 'trace' },
			{ name: 'Span', value: 'span' },
		],
		default: 'trace',
		description: 'Target to attach the feedback score to',
		displayOptions: {
			show: showFeedback,
		},
		routing: {
			send: {
				type: 'body',
				property: 'entity_type',
			},
		},
	},
	{
		displayName: 'Entity ID',
		name: 'feedbackEntityId',
		type: 'string',
		required: true,
		default: '',
		description: 'Trace or span identifier',
		displayOptions: {
			show: showFeedback,
		},
		routing: {
			send: {
				type: 'body',
				property: 'entity_id',
			},
		},
	},
	{
		displayName: 'Score Name',
		name: 'feedbackName',
		type: 'string',
		required: true,
		default: '',
		description: 'Metric name (accuracy, relevance, etc.)',
		displayOptions: {
			show: showFeedback,
		},
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'Score Value',
		name: 'feedbackValue',
		type: 'number',
		typeOptions: {
			numberPrecision: 3,
		},
		required: true,
		default: 0,
		description: 'Numeric score (0-1, 0-10, etc.)',
		displayOptions: {
			show: showFeedback,
		},
		routing: {
			send: {
				type: 'body',
				property: 'value',
			},
		},
	},
	{
		displayName: 'Reason',
		name: 'feedbackReason',
		type: 'string',
		default: '',
		description: 'Optional explanation for the score',
		displayOptions: {
			show: showFeedback,
		},
		routing: {
			send: {
				type: 'body',
				property: 'reason',
			},
		},
	},
];
