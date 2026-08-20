import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError, NodeOperationError } from 'n8n-workflow';

export class Mem0 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mem0',
		name: 'mem0',
		icon: { light: 'file:mem0.svg', dark: 'file:mem0.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'The memory layer for personalized AI Agents, user profiles & continuous context with Mem0',
		usableAsTool: true,
		defaults: {
			name: 'Mem0',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'mem0Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Memory',
						value: 'memory',
						description: 'Add, search, retrieve, and delete long-term memories and facts',
					},
					{
						name: 'User',
						value: 'user',
						description: 'View and manage user profiles and memory associations',
					},
				],
				default: 'memory',
			},

			// =========================================================================
			//                              MEMORY OPERATIONS
			// =========================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['memory'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add messages or text to automatically extract and store memories',
						action: 'Add a memory',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a specific memory by ID',
						action: 'Delete a memory',
					},
					{
						name: 'Delete All',
						value: 'deleteAll',
						description: 'Delete all memories for a specific user or agent',
						action: 'Delete all memories',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve a specific memory by ID',
						action: 'Get a memory',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many memories for a user or agent',
						action: 'List many memories',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Perform semantic vector search for relevant memories',
						action: 'Search memories',
					},
				],
				default: 'add',
			},
			{
				displayName: 'Memory Content / Text',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['add'],
					},
				},
				default: '',
				placeholder: 'User prefers vegetarian food and works as a software architect in San Francisco.',
				description: 'The conversation message or text from which Mem0 will automatically extract facts',
			},
			{
				displayName: 'Search Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search'],
					},
				},
				default: '',
				placeholder: 'What are the user dietary preferences?',
				description: 'Natural language query to search for relevant memories',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['add', 'search', 'getAll', 'deleteAll'],
					},
				},
				default: '',
				placeholder: 'user_123 or email',
				description: 'Unique identifier for the user to associate memories with',
			},
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['add', 'search', 'getAll', 'deleteAll'],
					},
				},
				default: '',
				placeholder: 'customer-support-agent',
				description: 'Optional agent ID to separate memories by specific AI agents',
			},
			{
				displayName: 'Memory ID',
				name: 'memoryId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['get', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the memory item',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['memory', 'user'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search', 'getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// =========================================================================
			//                               USER OPERATIONS
			// =========================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a user and all their stored memories',
						action: 'Delete a user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve a user profile and memory metadata',
						action: 'Get a user',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many users tracked in Mem0',
						action: 'List many users',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'User ID',
				name: 'targetUserId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the user',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let endpoint = '';
				let method = 'GET';
				let body: IDataObject | undefined = undefined;
				let qs: IDataObject = {};

				// =========================================================================
				//                             MEMORY ROUTING
				// =========================================================================
				if (resource === 'memory') {
					if (operation === 'add') {
						endpoint = '/v1/memories/';
						method = 'POST';
						const content = this.getNodeParameter('content', i) as string;
						const userId = this.getNodeParameter('userId', i, '') as string;
						const agentId = this.getNodeParameter('agentId', i, '') as string;

						body = {
							messages: [
								{
									role: 'user',
									content,
								},
							],
						};
						if (userId) body.user_id = userId;
						if (agentId) body.agent_id = agentId;
					} else if (operation === 'search') {
						endpoint = '/v1/memories/search/';
						method = 'POST';
						const query = this.getNodeParameter('query', i) as string;
						const userId = this.getNodeParameter('userId', i, '') as string;
						const agentId = this.getNodeParameter('agentId', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						body = {
							query,
							limit,
						};
						if (userId) body.user_id = userId;
						if (agentId) body.agent_id = agentId;
					} else if (operation === 'get') {
						const memoryId = this.getNodeParameter('memoryId', i) as string;
						endpoint = `/v1/memories/${memoryId}/`;
						method = 'GET';
					} else if (operation === 'getAll') {
						endpoint = '/v1/memories/';
						method = 'GET';
						const userId = this.getNodeParameter('userId', i, '') as string;
						const agentId = this.getNodeParameter('agentId', i, '') as string;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;

						if (userId) qs.user_id = userId;
						if (agentId) qs.agent_id = agentId;
						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.page_size = limit;
						}
					} else if (operation === 'delete') {
						const memoryId = this.getNodeParameter('memoryId', i) as string;
						endpoint = `/v1/memories/${memoryId}/`;
						method = 'DELETE';
					} else if (operation === 'deleteAll') {
						endpoint = '/v1/memories/';
						method = 'DELETE';
						const userId = this.getNodeParameter('userId', i, '') as string;
						const agentId = this.getNodeParameter('agentId', i, '') as string;
						if (userId) qs.user_id = userId;
						if (agentId) qs.agent_id = agentId;
					}
				}

				// =========================================================================
				//                              USER ROUTING
				// =========================================================================
				else if (resource === 'user') {
					if (operation === 'getAll') {
						endpoint = '/v1/users/';
						method = 'GET';
					} else if (operation === 'get') {
						const targetUserId = this.getNodeParameter('targetUserId', i) as string;
						endpoint = `/v1/users/${targetUserId}/`;
						method = 'GET';
					} else if (operation === 'delete') {
						const targetUserId = this.getNodeParameter('targetUserId', i) as string;
						endpoint = `/v1/users/${targetUserId}/`;
						method = 'DELETE';
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: "${resource}"`);
				}

				const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'mem0Api', {
					method,
					url: `https://api.mem0.ai${endpoint}`,
					body,
					qs,
					json: true,
				})) as IDataObject | IDataObject[];

				if (Array.isArray(response)) {
					for (const entry of response) {
						returnData.push({
							json: entry,
							pairedItem: { item: i },
						});
					}
				} else {
					returnData.push({
						json: response || { success: true },
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
