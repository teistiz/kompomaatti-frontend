import Vue from 'vue';
import Component from 'vue-class-component';
import _orderBy from 'lodash/orderBy';

import { ICompoEntry } from 'src/api/models';
import globalState from 'src/state';


@Component({
    props: {
        compoId: Number,
    },
})
export default class CompoEntries extends Vue<{ compoId: number }> {
    isPending = false;
    lastError: any;
    entries: ICompoEntry[] | null = null;

    created() {
        this.refresh();
    }

    get allEntriesSorted() {
        return _orderBy(this.entries || [], entry => entry.rank);
    }

    get qualifiedEntriesSorted() {
        return this.allEntriesSorted.filter(entry => !entry.disqualified);
    }

    async refresh() {
        const { api } = globalState;
        this.isPending = true;
        try {
            this.entries = await api.compoEntries.list({ compo: this.compoId });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    getEntryPath(entry) {
        return this.$route.path + 'entries/' + entry.id + '/';
    }

    render(h) {
        const entries = this.allEntriesSorted;
        return (
            <ul>
                {entries && entries.map(entry => (
                    <li>
                        {entry.rank ? entry.rank + '. ' : ''}
                        <router-link to={this.getEntryPath(entry)}>
                            {entry.name}
                        </router-link> - {entry.creator}
                    </li>
                ))}
            </ul>
        );
    }
}
