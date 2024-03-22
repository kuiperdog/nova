import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Vote {
    constructor(props?: Partial<Vote>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    from!: string

    @Index_()
    @Column_("text", {nullable: false})
    contract!: string

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    poll!: bigint

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    index!: bigint

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Index_()
    @Column_("int4", {nullable: true})
    candidate!: number | undefined | null

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    timestamp!: bigint
}
