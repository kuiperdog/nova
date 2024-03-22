import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Como {
    constructor(props?: Partial<Como>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    contract!: string

    @Index_()
    @Column_("text", {nullable: false})
    owner!: string

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint
}
