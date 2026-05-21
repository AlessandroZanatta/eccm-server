import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

export const DATA_FILE = process.env.ECCM_DATA_FILE ?? "/data/store.json";
export const STORE_KEY = "ethcm_profiles_v1";

export interface Profile {
	devices: unknown[];
	links: unknown[];
	portAliases: Record<string, unknown>;
	reservedPorts: Record<string, unknown>;
	portSpeeds: Record<string, unknown>;
	portVlans: Record<string, unknown>;
	portLinkedToNames: Record<string, unknown>;
}

export interface Store {
	current: string;
	profiles: Record<string, Profile>;
}

const defaultStore: Store = {
	current: "Default",
	profiles: {
		Default: {
			devices: [],
			links: [],
			portAliases: {},
			reservedPorts: {},
			portSpeeds: {},
			portVlans: {},
			portLinkedToNames: {},
		},
	},
};

export function readStore(): Store {
	try {
		if (existsSync(DATA_FILE))
			return JSON.parse(readFileSync(DATA_FILE, "utf8")) as Store;
	} catch {}
	return defaultStore;
}

export function writeStore(data: Store): void {
	mkdirSync(dirname(DATA_FILE), { recursive: true });
	writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function buildShim(store: Store): string {
	return `<script>
    var storeKey = ${JSON.stringify(STORE_KEY)};
    var _origSetItem = Storage.prototype.setItem;
    _origSetItem.call(localStorage, storeKey, ${JSON.stringify(JSON.stringify(store))});
    Storage.prototype.setItem = function(key, value) {
      _origSetItem.call(this, key, value);
      if (this === localStorage && key === storeKey) {
        fetch('/api/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: value
        }).then(function(r) {
          if (!r.ok) alert('Server save failed (HTTP ' + r.status + '). Changes kept locally only.');
        }).catch(function(err) {
          alert('Server save failed: ' + err + '. Changes kept locally only.');
        });
      }
    };
</script>`;
}
