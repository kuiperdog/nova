import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Collection {
    constructor(props?: Partial<Collection>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {array: true, nullable: false})
    artists!: (string)[]

    @Index_()
    @Column_("text", {nullable: false})
    member!: string

    @Index_()
    @Column_("text", {nullable: false})
    season!: string

    @Index_()
    @Column_("text", {nullable: false})
    class!: string

    @Index_()
    @Column_("text", {nullable: false})
    number!: string

    @Column_("text", {nullable: false})
    thumbnail!: string

    @Column_("text", {nullable: false})
    front!: string

    @Column_("text", {nullable: false})
    back!: string

    @Column_("text", {nullable: false})
    textColor!: string

    @Column_("text", {nullable: false})
    backgroundColor!: string

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    timestamp!: bigint
}
