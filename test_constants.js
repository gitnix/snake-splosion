const server_utils = () =>
	Object.assign(require('./server/utils'), {
		getValidRandomKey: () => mockedKey,
	})

module.exports = {
	mocked_key: '16_2',
	p1_id: 'p1_id',
	p1_name: 'p1_name',
	p2_id: 'p2_id',
	p2_name: 'p2_name',
	p3_id: 'p3_id',
	p3_name: 'p3_name',
	p4_id: 'p4_id',
	p4_name: 'p4_name',
	test_color: 'GREEN',
	server_utils,
}
