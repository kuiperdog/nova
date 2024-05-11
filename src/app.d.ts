import { Collection, Objekt, Transfer, Vote, Como } from "./model";

declare global {
    namespace App {
        interface PageState {
            collection: Collection | null,
            objekt: Objekt | null,
            previous: string | null
        }
    }

    namespace Cosmo {
        interface Artist {
            name: string;
            title: string;
            logoImageUrl: string;
            contracts: {
                Como: string;
                Objekt: string;
                ObjektMinter: string;
                Governor: string;
                CommunityPool: String;
                ComoMinter: string;
            };
            members: {
                name: string;
                artist: string;
                units?: string[];
                alias?: string;
                profileImageUrl: string;
                mainObjektImageUrl: string;
                order: number;
            }[];
        }
    
        interface User {
            nickname: string;
            address: string;
            profileImageUrl: string;
        }

        interface Poll {
            id: number;
            artist: string;
            pollIdOnChain: number;
            gravityId: number;
            type: string;
            indexInGravity: number;
            title: string;
            imageUrl: string;
            startDate: string;
            endDate: string;
            revealDate: string;
            finalized: boolean;
        }
    
        interface PollDetail extends Poll {
            pollViewMetadata: {
                title: string;
                background: string | null;
                defaultContent?: any;
                selectedContent?: {
                    choiceId: string;
                    content: any;
                }[];
                slots?: {
                    id: string;
                    name: string;
                    title: string;
                    description: string;
                    backgroundImageUrl: string;
                }[];
                slotChoices?: {
                    id: string;
                    name: string;
                    alias: string | undefined;
                    roundImageUrl: string | null;
                    slotCardImageUrl: string | null;
                }[];
                choiceIdToSlotChoicesMapTable?: {
                    choiceId: string;
                    slotIds: string[];
                    slotChoiceIds: string[];
                }[];
            };
            choices: {
                id: string;
                title: string;
                description: string;
                txImageUrl: string;
            }[];
        }
    
        interface Gravity {
            id: number;
            artist: string;
            title: string;
            description: string;
            type: string;
            pollType: string;
            bannerImageUrl: string;
            entireStartDate: string;
            entireEndDate: string;
            body: any[];
            polls: Poll[];
            contractOutlink: string;
        }
    }
    
    declare const __VERSION__: string;
    declare const __SUBSQUID_API__: string;
    declare const __COSMO_API__: string;
    declare const __COSMO_PROXY__: string;
    declare const __POLYGON_RPC__: string;
}