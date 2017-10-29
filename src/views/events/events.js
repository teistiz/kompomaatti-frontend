import _orderBy from 'lodash/orderBy';
import globalState from 'src/state';
import template from './events.html';


const EventsView = {
    template,
    data: () => ({
        globalState,
        isLoading: false,
        events: [],
    }),
    created() {
        this.refresh();
    },
    methods: {
        async refresh() {
            const { api } = this.globalState;
            this.isLoading = true;
            try {
                const events = await api.events.list();
                this.events = _orderBy(events, event => event.date, 'desc');
            } catch(error) {
                this.events = [];
            }
            this.isLoading = false;
        }
    }
};

export default EventsView;
