<h2 align="center">
  <img src="https://github.com/kuiperdog/nova/assets/130880623/c4b4d776-3280-4c2d-9043-27dc7e560f4f" width="350">

  Explore the cosmos 🚀
</h2>

Nova is a Polygon psuedo-explorer serving as an application analyzer for [Cosmo](https://play.google.com/store/apps/details?id=com.modhaus.cosmo). The primary goal of Nova is to obfuscate abstract details of blockchain behind the specific implementations of Cosmo itself, eliminating the need for generic explorers and greatly increasing accessibility. This also directly aligns with the values of the Cosmo system, as Modhaus has stated a desire for transparency, the scale of which can multiply with mass availability of Cosmo data. Convenience features provided by Nova include:
- A global Object catalogue
- User and Objekt trade histories
- Live COMO counting in gravities
- Per-user collections and statistics
- Individual gravity voting records
- Objekt serial reverse-lookups

And more.

## Design
As a fully serverless web-app, Nova stores as little static data as possible on the client, instead aggregating data on-demand from a variety of sources. On-chain data is retrieved directly from Polygon using [RPC](https://polygon-rpc.com) with ethers,js for individual data points, or with a custom [Cosmo Subsquid indexer](https://github.com/kuiperdog/cosmo-indexer) for bulk archived data. Off-chain data is retrieved directly from the Cosmo API, with certain data-points being archived and pre-populated by the indexing engine as part of organizing tokens or events. The web-app itself is built with Vue 3 and Vite, with fonts and colour schemes extracted directly from Cosmo itself for added cohesion in design language.

## Contributions
Pull requests are happily accepted as contributions to Nova's codebase, especially those patching bugs, increasing security, or optimizing performance. Before opening a PR, please ensure that the style and formatting of your work matches that of the rest of the project to avoid being slowed down by change requests.

Alternatively, tips are gladly accepted via ETH as a form of contribution to the project.

Address: 0x661CB72daC01Fb6Ea7f62ab7f0315ae98a7713aF

![QR](https://github.com/kuiperdog/nova/blob/main/src/assets/images/support-qr.png)

## License
Nova is licensed under the copyleft [GPLv3](LICENSE).
