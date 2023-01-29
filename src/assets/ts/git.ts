export class Git {
    public head: {
        id: string;
        short_id: string;
        branch: string;
        tag: string;
        message: string;
        author: {
            name: string;
            email: string;
            date: string;
        };
        committer: {
            name: string;
            email: string;
            date: string;
        };
    };

    public last_commit: {
        id: string;
        short_id: string;
        branch: string;
        tag: string;
        message: string;
        date: string;
        author: {
            name: string;
            email: string;
        };
    };

    public last_tag: {
        id: string;
        short_id: string;
        name: string;
        date: string;
        message: string;
        author: {
            name: string;
            email: string;
        };
    };


    constructor() {
        this.head = {
            id: "",
            short_id: "",
            branch: "",
            tag: "",
            message: "",
            author: {
                name: "",
                email: "",
                date: ""
            },
            committer: {
                name: "",
                email: "",
                date: ""
            }
        };

        this.last_commit = {
            id: "",
            short_id: "",
            branch: "",
            tag: "",
            message: "",
            date: "",
            author: {
                name: "",
                email: "",
            },
        };

        this.last_tag = {
            id: "",
            short_id: "",
            name: "",
            date: "",
            message: "",
            author: {
                name: "",
                email: "",
            },
        };
    }
}