<h2 align="center">
  <img src="https://github.com/kuiperdog/nova/assets/130880623/c4b4d776-3280-4c2d-9043-27dc7e560f4f" width="350">

  Explore the cosmos 🚀
</h2>

Cosmo is an app developed by South Korean Web3 start-up and entertainment agency Modhaus Inc., which aims to decentralize the K-pop industry with blockchain technology. The app builds upon the industry's success with collectible photocards (akin to baseball or hockey cards) by introducing digital photocard NFTs named Objekts. Objekts are much more than just trading cards, as holders earn governance tokens called COMO, which can be used to vote in Gravities — polls held to determine various aspects of their artists' productions, such as album tracklists, tour setlists, merchandise designs, music video releases, and more.

Nova is a blockchain explorer designed specifically for Cosmo, which aims to increase the transparency of the Cosmo system by making its Polygon transaction data easily accessible. Nova follows Modhaus' own values of making blockchain user-friendly for mass adoption by obfuscating block data, such as that provided by generic tools like Polygonscan, behind Cosmo's specific implementations, with features such as:

- A global filterable catalogue of all Objekt types
- Weekly Objekt minting volume statistics
- Objekt owner reverse look-ups by serial
- User profiles searchable by in-app ID or Polygon address
- Per-user and per-Objekt transfer histories
- User COMO statistics with rankings and distribution calendars
- Objekt bookmark system with exporting in standard trade format
- Live Gravity result counting with COMO/time density graphs
- Top vote leaderboards by impact per each Gravity poll
- Individual Gravity voting records including chosen candidates
- Automatic conversion from Polygon addresses to in-app IDs
- Multilingual UI with support for English and Korean

And more.

As a fully serverless SPA, Nova stores as little static data as possible on the client. On-chain data is retrieved through a custom [Subsquid indexer](https://github.com/kuiperdog/cosmo-indexer) which aggregates transaction data and serves it through a custom GraphQL API. For real time on-chain data, Nova either fetches data directly from Polygon by polling via RPC with ethers.js, or via the indexer's API for pre-processed data. Off-chain data is retrieved through a custom proxy of the Cosmo API powered by edge functions, as well as through archived data provided by the indexer as is used to organize tokens. The proxy mirrors the behaviour of the official API and extends its functionality by batching requests, caching responses via Cloudflare, and injecting an auto-generated token for authorized requests.

Tips are accepted through [GitHub Sponsors](https://github.com/sponsors/kuiperdog) and [Patreon](https://patreon.com/kuiperdog), which firstly go towards covering the hosting and infrastructure costs of this project.

Nova is licensed under the copyleft [GPLv3](LICENSE).
