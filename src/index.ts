import Dotenv from 'dotenv';
import Debug from 'debug';
import Fetch from 'node-fetch';

Dotenv.config();

const debug = Debug('discogs:info');

// console.info('Welcome To The Last Discogs API v2 Library You Will Ever Need')
console.info('JS TS Discogs API v2 Library Version 0.0.1')
console.info('© Dex Vinyl & Mike Elsmore 2022')
console.info('Released under MIT License')

interface Ratelimit {
    ratelimit: number,
    remaining: number,
    used: number,
}

export class Client {
    private protocol = 'https';
    private host: string;
    private port: number;
    private userAgent: string;
    private auth: string|null;
    private ratelimit: Ratelimit;
    private discogsUserName: string;
    private perPage: string;

    private defaults = {
        host: 'api.discogs.com',
        port: 443,
        userAgent: 'JSTSDiscogsAPIV2Library',
        apiVersion: 'v2',
        outputFormat: 'discogs',    // Possible values: 'discogs' / 'plaintext' / 'html'
        requestLimit: 25,           // Maximum number of requests to the Discogs API per interval
        requestLimitAuth: 60,       // Maximum number of requests to the Discogs API per interval when authenticated
        requestLimitInterval: 60000, // Request interval in milliseconds
        discogsUserName:' ', // Default Username can only be set in ENV file
        perPage:'50',
    }

    constructor({
        host,
        port,
        userAgent,
        token,
        key,
        secret,
        discogsUserName,
    }: {
        host?: string,
        port?: number;
        userAgent?: string;
        token?: string,
        key?: string,
        secret?: string,
        discogsUserName?: string,
    }) {
        this.discogsUserName = process.env.DISCOGS_USER_NAME || this.defaults.discogsUserName;
        this.host = host || this.defaults.host;
        this.port = port || this.defaults.port;
        this.userAgent = userAgent || this.defaults.userAgent;
        this.auth = this.createAuthString({ token, key, secret });
        this.ratelimit = {
            ratelimit: 25,
            remaining: 25,
            used: 0,
        };
        this.perPage = process.env.DISCOGS_PER_PAGE || this.defaults.perPage;
    }

    private createAuthString({
        token,
        key,
        secret,
    }: {
        token?: string,
        key?: string,
        secret?: string,
    }) {
        let authString;
        if (token || process.env.DISCOGS_API_TOKEN) {
            authString = `token=${(token || process.env.DISCOGS_API_TOKEN)}`;
        } else if ((key || process.env.DISCOGS_API_KEY) && (secret || process.env.DISCOGS_API_SECRET)) {
            authString = `key=${(key || process.env.DISCOGS_API_KEY)}, secret=${(secret || process.env.DISCOGS_API_SECRET)}`;
        }
        return authString || null;
    }

    private async request(path: string) {
        const requestHeaders: any = {
            'User-Agent': this.userAgent,
        };
        if (this.auth) {
            requestHeaders['Authorization'] = `Discogs ${this.auth}`
        }
        try {
            const response = await Fetch(`${this.protocol}://${this.host}/${path}`, {
                // method: 'post',
                // body: JSON.stringify({}),
                headers: requestHeaders,
            });
            const responseHeaders = response.headers;
            const data = await response.json();
            this.ratelimit = {
                ratelimit: Number(responseHeaders.get('x-discogs-ratelimit')),
                remaining: Number(responseHeaders.get('x-discogs-ratelimit-remaining')),
                used: Number(responseHeaders.get('x-discogs-ratelimit-used'))
            }
            return {
                data,
                headers: responseHeaders,
            };
        } catch (error) {
            console.error(error);
        }
    }

    public getRatelimit(): Ratelimit {
        return this.ratelimit;
    }

    // Helper Functions
    public getRequest (path: string) {
        return this.request(path);
    }

   
//
// USER SPECIFIC ENDPOINTS
// 
    public getUser() {
        return this.request(`users/${this.discogsUserName}`);
    }
    public getUserCollection(pageNumber:string, sort:string, sortOrder:string) {
        if (!pageNumber){
            pageNumber="1"
        }
        if (!sortOrder){
            sortOrder="desc"
        }
        // let
        if (!sort) {
            sort = "added"
        }
        else if (sort == "year") {}
        else if (sort == "artist") {}
        else if (sort == "title") {}
        else if (sort == "catno"){}
        else if (sort == "format") {}
        else if (sort == "rating") {}
        else{
            sort = "added"
        }
        return this.request(`users/${this.discogsUserName}/collection?sort=${sort}&sort_order=${sortOrder}&per_page=${this.perPage}&page=${pageNumber}`);
    }
    public getUserWantlist(pageNumber:string, sort:string, sortOrder:string) {
        if (!pageNumber){
            pageNumber="1"
        }
        if (!sortOrder){
            sortOrder="desc"
        }
        // let
        if (!sort) {
            sort = "added"
        }
        else if (sort == "year") {}
        else if (sort == "artist") {}
        else if (sort == "title") {}
        else if (sort == "catno"){}
        else if (sort == "format") {}
        else if (sort == "rating") {}
        else{
            sort = "added"
        }
        return this.request(`users/${this.discogsUserName}/wants?sort=${sort}&sort_order=${sortOrder}&per_page=${this.perPage}&page=${pageNumber}`);
    }
    public getUserFolders() {
        return this.request(`users/${this.discogsUserName}/collection/folders`);
    }
    public getUserFolderContents(folder:string, pageNumber:string, sort:string, sortOrder:string) {
        if (!pageNumber){
            pageNumber="1"
        }
        if (!sortOrder){
            sortOrder="desc"
        }
        // let
        if (!sort) {
            sort = "added"
        }
        else if (sort == "year") {}
        else if (sort == "artist") {}
        else if (sort == "title") {}
        else if (sort == "catno"){}
        else if (sort == "format") {}
        else if (sort == "rating") {}
        else{
            sort = "added"
        }
        return this.request(`users/${this.discogsUserName}/collection/folders/${folder}/releases?sort=${sort}&sort_order=${sortOrder}&per_page=${this.perPage}&page=${pageNumber}`);
    }
    public getUserCollectionValue() {
        return this.request(`users/${this.discogsUserName}/collection/value`);
    }
    
//
// RELEASE ENDPOINTS
//
    
    public getRelease(releaseId: string) {
        return this.request(`releases/${releaseId}`);
    }
    public getReleaseUserRating(releaseId: string) {
        return this.request(`releases/${releaseId}/rating/${this.discogsUserName}`);
    }
    public getReleaseCommunityRating(releaseId: string) {
        return this.request(`releases/${releaseId}/rating`);
    }
    public getReleaseStats(releaseId: string) {
        return this.request(`releases/${releaseId}/stats`);
    }
    public getMasterRelease(masterId: string) {
        return this.request(`masters/${masterId}`);
    }
    public getMasterReleaseVersions(masterId: string) {
        return this.request(`masters/${masterId}/versions`); // takes parameters, needs adding
    }

//
// ARTIST ENDPOINTS
//

    public getArtistDetails(ArtistId: string) {
        return this.request(`artists/${ArtistId}`);
    }
    public getArtistReleases(ArtistId: string, pageNumber:string, sort:string, sortOrder:string) {
        if (!pageNumber){
            pageNumber="1"
        }
        if (!sortOrder){
            sortOrder="desc"
        }
        // let
        if (!sort) {
            sort = "title"
        }
        else if (sort == "year") {}
        else if (sort == "format") {}
        else{
            sort = "title"
        }
        return this.request(`artists/${ArtistId}/releases?sort=${sort}&sort_order=${sortOrder}&per_page=${this.perPage}&page=${pageNumber}`); // takes parameters, needs adding
    }

    
//
// LABEL ENDPOINTS
//

    public getLabelDetails(LabelId: string) {
        return this.request(`labels/${LabelId}`);
    }
    public getLabelReleases(LabelId: string, pageNumber:string, sort:string, sortOrder:string) {
        if (!pageNumber){
            pageNumber="1"
        }
        if (!sortOrder){
            sortOrder="desc"
        }
        // let
        if (!sort) {
            sort = "title"
        }
        else if (sort == "year") {}
        else if (sort == "artist") {}
        else if (sort == "catno"){}
        else if (sort == "format") {}
        else{
            sort = "added"
        }
        return this.request(`labels/${LabelId}/releases?sort=${sort}&sort_order=${sortOrder}&per_page=${this.perPage}&page=${pageNumber}`); // takes parameters, needs adding
}

}
export default Client;