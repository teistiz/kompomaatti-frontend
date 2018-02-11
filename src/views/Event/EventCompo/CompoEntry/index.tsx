import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { ICompoEntry } from 'src/api/interfaces';
import globalState from 'src/state';


const { translate } = globalState;


@Component
export default class CompoEntry extends Vue {
    @Prop()
    entryId: string;

    entry: ICompoEntry | null = null;
    isPending = false;
    lastError: any;

    created() {
        this.refresh();
    }

    @Watch('entryId')
    onEntryIdChange() {
        this.refresh();
    }

    get entryIdParsed() {
        return Number.parseInt(this.entryId);
    }

    get viewTitle() {
        const { entry } = this;
        return entry && entry.name || '(unnamed entry)';
    }

    async refresh() {
        const id = this.entryIdParsed;

        if (!id) {
            return;
        }

        this.isPending = true;
        try {
            this.entry = await globalState.api.compoEntries.get(id);
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    render(h) {
        const { entry } = this;

        return (
            <div class="compo-entry">
                {entry && <div class="entry-info">
                    <div class="entry-title">
                        <h3>{entry.name}</h3>
                        <p>{entry.creator}</p>
                    </div>
                    {entry.imagefile_medium_url && (
                        <div class="entry-image">
                            <h4>{translate('entry.image')}</h4>
                            <a target="_blank" href={entry.imagefile_original_url}>
                                <img src={entry.imagefile_medium_url} />
                            </a>
                        </div>
                    )}
                    {entry.disqualified && <div class="entry-disqualified">
                        <h4>{translate('entry.disqualified')}</h4>
                        <p>{entry.disqualified_reason}</p>
                    </div>}
                    <div class="entry-description">
                        <h4>{translate('entry.description')}</h4>
                        <p class="text-pre-wrap">{ entry.description }</p>
                    </div>
                    <div class="entry-files">
                        <h4>{translate('entry.files')}</h4>
                        { entry.entryfile_url && <p>
                            <a target="_blank" href={entry.entryfile_url}>
                                {translate('entry.entryfile')}
                            </a>
                        </p>}
                        { entry.sourcefile_url && <p>
                            <a target="_blank" href={entry.sourcefile_url}>
                                {translate('entry.sourcefile')}
                            </a>
                        </p>}
                    </div>
                </div>}
            </div>
        );
    }
}
