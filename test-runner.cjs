#!/usr/bin/env node

/**
 * Comprehensive Test Runner for Real Estate Valuation Platform
 * 
 * This script runs all test suites and generates comprehensive reports
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = {
      unit: { passed: 0, failed: 0, total: 0 },
      e2e: { passed: 0, failed: 0, total: 0 },
      coverage: null,
      startTime: new Date(),
      endTime: null
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      error: '\x1b[31m',   // Red
      warning: '\x1b[33m', // Yellow
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async runUnitTests() {
    this.log('🧪 Running Unit Tests...', 'info');
    
    try {
      // Run Jest tests with coverage
      const result = execSync('npm run test:coverage', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.log('✅ Unit tests completed successfully', 'success');
      
      // Parse Jest output for test results
      this.parseJestResults(result);
      
      return true;
    } catch (error) {
      this.log('❌ Unit tests failed', 'error');
      this.log(error.stdout || error.message, 'error');
      
      // Try to parse partial results
      if (error.stdout) {
        this.parseJestResults(error.stdout);
      }
      
      return false;
    }
  }

  parseJestResults(output) {
    // Parse Jest output to extract test results
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('Tests:')) {
        const match = line.match(/(\d+) passed.*?(\d+) total/);
        if (match) {
          this.results.unit.passed = parseInt(match[1]);
          this.results.unit.total = parseInt(match[2]);
          this.results.unit.failed = this.results.unit.total - this.results.unit.passed;
        }
      }
      
      if (line.includes('Coverage summary')) {
        // Extract coverage information
        this.results.coverage = 'Available in coverage/index.html';
      }
    }
  }

  async runE2ETests() {
    this.log('🎭 Running End-to-End Tests...', 'info');
    
    try {
      // Start development server in background
      this.log('🚀 Starting development server...', 'info');
      const devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });
      
      // Wait for server to start
      await this.waitForServer('http://localhost:5173', 30000);
      
      try {
        // Run Playwright tests
        const result = execSync('npm run test:e2e', { 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        this.log('✅ E2E tests completed successfully', 'success');
        this.parsePlaywrightResults(result);
        
        return true;
      } finally {
        // Kill development server
        devServer.kill();
        this.log('🛑 Development server stopped', 'info');
      }
    } catch (error) {
      this.log('❌ E2E tests failed', 'error');
      this.log(error.stdout || error.message, 'error');
      
      if (error.stdout) {
        this.parsePlaywrightResults(error.stdout);
      }
      
      return false;
    }
  }

  parsePlaywrightResults(output) {
    // Parse Playwright output to extract test results
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('passed') && line.includes('failed')) {
        const passedMatch = line.match(/(\d+) passed/);
        const failedMatch = line.match(/(\d+) failed/);
        
        if (passedMatch) {
          this.results.e2e.passed = parseInt(passedMatch[1]);
        }
        if (failedMatch) {
          this.results.e2e.failed = parseInt(failedMatch[1]);
        }
        
        this.results.e2e.total = this.results.e2e.passed + this.results.e2e.failed;
      }
    }
  }

  async waitForServer(url, timeout = 30000) {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          this.log('✅ Development server is ready', 'success');
          return;
        }
      } catch (error) {
        // Server not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Development server failed to start within timeout');
  }

  generateReport() {
    this.results.endTime = new Date();
    const duration = this.results.endTime - this.results.startTime;
    
    const report = {
      summary: {
        totalTests: this.results.unit.total + this.results.e2e.total,
        totalPassed: this.results.unit.passed + this.results.e2e.passed,
        totalFailed: this.results.unit.failed + this.results.e2e.failed,
        duration: `${Math.round(duration / 1000)}s`,
        timestamp: this.results.endTime.toISOString()
      },
      unit: this.results.unit,
      e2e: this.results.e2e,
      coverage: this.results.coverage
    };
    
    // Save JSON report
    const reportPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate HTML report
    this.generateHTMLReport(report);
    
    // Print summary to console
    this.printSummary(report);
    
    return report;
  }

  generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Results - Real Estate Valuation Platform</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .card.success { border-left: 4px solid #28a745; }
        .card.error { border-left: 4px solid #dc3545; }
        .card.info { border-left: 4px solid #17a2b8; }
        .number { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .section { margin-bottom: 30px; }
        .section h2 { border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #28a745, #20c997); transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 Real Estate Valuation Platform</h1>
            <h2>Test Results Report</h2>
            <p>Generated on ${report.summary.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="card info">
                <h3>Total Tests</h3>
                <div class="number">${report.summary.totalTests}</div>
            </div>
            <div class="card success">
                <h3>Passed</h3>
                <div class="number">${report.summary.totalPassed}</div>
            </div>
            <div class="card ${report.summary.totalFailed > 0 ? 'error' : 'success'}">
                <h3>Failed</h3>
                <div class="number">${report.summary.totalFailed}</div>
            </div>
            <div class="card info">
                <h3>Duration</h3>
                <div class="number">${report.summary.duration}</div>
            </div>
        </div>
        
        <div class="section">
            <h2>📊 Test Coverage</h2>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${report.summary.totalTests > 0 ? (report.summary.totalPassed / report.summary.totalTests * 100) : 0}%"></div>
            </div>
            <p>Success Rate: ${report.summary.totalTests > 0 ? Math.round(report.summary.totalPassed / report.summary.totalTests * 100) : 0}%</p>
        </div>
        
        <div class="section">
            <h2>🧪 Test Suites</h2>
            <div class="test-grid">
                <div class="card">
                    <h3>Unit Tests</h3>
                    <p>Passed: ${report.unit.passed}</p>
                    <p>Failed: ${report.unit.failed}</p>
                    <p>Total: ${report.unit.total}</p>
                </div>
                <div class="card">
                    <h3>E2E Tests</h3>
                    <p>Passed: ${report.e2e.passed}</p>
                    <p>Failed: ${report.e2e.failed}</p>
                    <p>Total: ${report.e2e.total}</p>
                </div>
            </div>
        </div>
        
        ${report.coverage ? `
        <div class="section">
            <h2>📈 Code Coverage</h2>
            <p>${report.coverage}</p>
        </div>
        ` : ''}
    </div>
</body>
</html>
    `;
    
    const htmlPath = path.join(__dirname, 'test-report.html');
    fs.writeFileSync(htmlPath, html);
    this.log(`📄 HTML report generated: ${htmlPath}`, 'success');
  }

  printSummary(report) {
    this.log('\n' + '='.repeat(60), 'info');
    this.log('🏠 REAL ESTATE VALUATION PLATFORM - TEST SUMMARY', 'info');
    this.log('='.repeat(60), 'info');
    
    this.log(`📊 Total Tests: ${report.summary.totalTests}`, 'info');
    this.log(`✅ Passed: ${report.summary.totalPassed}`, 'success');
    this.log(`❌ Failed: ${report.summary.totalFailed}`, report.summary.totalFailed > 0 ? 'error' : 'success');
    this.log(`⏱️  Duration: ${report.summary.duration}`, 'info');
    
    if (report.summary.totalTests > 0) {
      const successRate = Math.round(report.summary.totalPassed / report.summary.totalTests * 100);
      this.log(`📈 Success Rate: ${successRate}%`, successRate >= 80 ? 'success' : 'warning');
    }
    
    this.log('\n📋 Detailed Results:', 'info');
    this.log(`   🧪 Unit Tests: ${report.unit.passed}/${report.unit.total} passed`, 'info');
    this.log(`   🎭 E2E Tests: ${report.e2e.passed}/${report.e2e.total} passed`, 'info');
    
    if (report.coverage) {
      this.log(`   📈 Coverage: ${report.coverage}`, 'info');
    }
    
    this.log('\n📄 Reports generated:', 'info');
    this.log('   - test-results.json (JSON format)', 'info');
    this.log('   - test-report.html (HTML format)', 'info');
    this.log('   - coverage/index.html (Coverage report)', 'info');
    
    this.log('='.repeat(60), 'info');
  }

  async run() {
    this.log('🚀 Starting Comprehensive Test Suite...', 'info');
    
    // Run unit tests
    const unitSuccess = await this.runUnitTests();
    
    // Run E2E tests
    const e2eSuccess = await this.runE2ETests();
    
    // Generate report
    const report = this.generateReport();
    
    // Exit with appropriate code
    const allPassed = unitSuccess && e2eSuccess && report.summary.totalFailed === 0;
    process.exit(allPassed ? 0 : 1);
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;