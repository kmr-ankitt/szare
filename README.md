# Szare

Szare is a fast and offline file-sharing application that requires zero configuration.


![image](https://github.com/user-attachments/assets/4fafcacf-ebe7-42d4-815f-65a2622fb326)


## Features

* 🌐 Fully self-hosted & offline
* 🚀 **460+ MB/s** LAN transfers (5 GB in 11s)
* 📱 QR-based instant pairing
* 📦 Optimized for files up to **10 GB**
* 📂 Directory-aware file browser
* 📊 Real-time transfer progress
* 🧠 Low-memory streaming (**<7 KB / request**)
* ⚡ Zero-copy downloads with `io.CopyBuffer`

## Quick Installation

- _Currently only Supports Linux systems 🐧_

- _Ensure that nodejs is installed on your system._

To install Szare, run the following command:

```bash
curl -sSL https://raw.githubusercontent.com/kmr-ankitt/szare/main/install.sh | bash
```
## Usage Instructions

1. **Start the Application**:
   - If you installed Szare using the quick installation method, simply run the following command to start the application:
     ```bash
     szare
     ```
   - If you built Szare manually, ensure you are in the project directory and run:
     ```bash
     make run
     ```
2. **Sharing Files**:
    - All the files from the directory you started the application in are shared.
    - If you want to share from your other devices then you can upload files from the web interface and It will be downloaded to the directory you started the application in.

3. **Receiving Files**:
   - Other devices on the **same local network** can access the shared files by scanning the QR code presented at the terminal or navigating to `http://<your-local-ip>:3002` in their web browser.
   - They can browse the available files and download them as needed.

4. **Real-time Progress Tracking**:
   - The web interface provides real-time progress tracking for both uploads and downloads, allowing you to monitor the status of your file transfers.

## Manual Build

To manually build Szare, ensure you have the following dependencies installed:
  - Go
  - Node.js
  - npm

Clone the repository and navigate to the project directory:

```bash
git clone https://www.github.com/kmr-ankitt/szare
cd szare
```

Build the backend and frontend components:

```bash
make build
```

Run the application:

```bash
make run
```

## Benchmarks

<details>
  <summary>Apache Benchmark</summary>
    > All benchmarks were performed on a local NVMe system using `curl` over LAN.

    ### Upload Performance

    ```bash
    fallocate -l 5G bench5g.bin
    time curl -F "file=@bench5g.bin" http://localhost:3003/api/send
    ```

    **Result**

    ```
    5 GB uploaded in 11.05 seconds
    ```

    **Throughput**

    | File Size | Time    | Speed        |
    | --------- | ------- | ------------ |
    | 5 GB      | 11.05 s | **463 MB/s** |

    ---

    ### Handler Microbenchmark

    ```bash
    go test ./cmd/api -bench=BenchmarkUpload -benchmem
    ```

    ```
    BenchmarkUpload-12    81   13861983 ns/op   6247 B/op   694 allocs/op
    ```

    | Metric                | Value             |
    | --------------------- | ----------------- |
    | 5 MB multipart upload | **13.8 ms / op**  |
    | Memory per request    | **~6 KB**         |
    | Allocations           | **694 / request** |

    ---

    ### System Stability

    * CPU usage: **< 15%** during sustained multi-GB transfer
    * Memory usage: Stable, no leaks observed
    * Tested file sizes: up to **10 GB**

    ---

    These benchmarks demonstrate Szare’s ability to deliver **near-disk-speed file transfers** over a local network with minimal resource overhead.

</details>

## Uninstallation

To uninstall Szare, run the following command:

```bash
curl -sSL https://raw.githubusercontent.com/kmr-ankitt/szare/main/uninstall.sh | bash
```
