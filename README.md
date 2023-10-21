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
Currently, all infrastructure and registration fees incurred by Nova are paid out of pocket by the developer. If you are interested in supporting the future of this project, one-time and recurring donations are available via [GitHub Sponsors](https://github.com/sponsors/kuiperdog). 

Alternatively, tips are also gladly accepted via ETH.

Address: 0x18ea10a741Bf3565D45Ba8E7d89B0b5469BeD3fF

![QR](https://github.com/kuiperdog/nova/blob/main/src/assets/images/support-qr.png)

## License
Nova is licensed under the copyleft [GPLv3](LICENSE).
